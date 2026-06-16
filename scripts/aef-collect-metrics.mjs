/**
 * collect-metrics.mjs
 *
 * Aggregates agent activity metrics from local audit events, optional GitHub
 * API data, and framework adoption state into a dated report JSON.
 *
 * Usage:
 *   node scripts/collect-metrics.mjs [--repo owner/repo] [--token ghtoken]
 *                                     [--period days] [--output metrics/reports/]
 */

import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync, copyFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'
import { checkAdoption } from './aef-check-adoption.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const frameworkRoot = resolve(__dirname, '..')

// ── Arg parsing ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
function getArg(flag) {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const repo      = getArg('--repo')
const token     = getArg('--token')
const periodDays = parseInt(getArg('--period') ?? '30', 10)
const outputDir = getArg('--output') ?? join(frameworkRoot, 'metrics', 'reports')

const periodStart = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000)

// ── Audit event scanner ──────────────────────────────────────────────────────

function scanAuditEvents(auditDir) {
  const results = []
  if (!existsSync(auditDir)) return results

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.name.endsWith('.json')) {
        try {
          const raw = JSON.parse(readFileSync(full, 'utf8'))
          results.push(raw)
        } catch { /* skip malformed */ }
      }
    }
  }

  walk(auditDir)
  return results
}

function aggregateAuditEvents(events, since) {
  const filtered = events.filter(e => {
    const ts = e.timestamp ?? e.occurred_at ?? e.created_at
    return ts ? new Date(ts) >= since : true
  })

  const byAgent   = {}
  const byStep    = {}
  const byAutonomy = {}
  const byOutcome = {}
  const durationByActivity = {}

  for (const e of filtered) {
    const agent    = e.agent ?? e.agent_id ?? 'unknown'
    const step     = e.step ?? e.activity ?? e.event_type ?? 'unknown'
    const autonomy = e.autonomy_level ?? e.level ?? 'unknown'
    const outcome  = e.outcome ?? e.result ?? 'unknown'
    const duration = typeof e.duration_ms === 'number' ? e.duration_ms
                   : typeof e.duration_seconds === 'number' ? e.duration_seconds * 1000
                   : null

    byAgent[agent]     = (byAgent[agent] ?? 0) + 1
    byStep[step]       = (byStep[step] ?? 0) + 1
    byAutonomy[autonomy] = (byAutonomy[autonomy] ?? 0) + 1
    byOutcome[outcome] = (byOutcome[outcome] ?? 0) + 1

    if (duration !== null) {
      if (!durationByActivity[step]) durationByActivity[step] = []
      durationByActivity[step].push(duration)
    }
  }

  const avgDurationByActivity = {}
  for (const [act, durations] of Object.entries(durationByActivity)) {
    avgDurationByActivity[act] = Math.round(durations.reduce((s, d) => s + d, 0) / durations.length)
  }

  const manualCount   = (byAutonomy['manual'] ?? 0) + (byAutonomy['L0'] ?? 0)
  const governedCount = filtered.length - manualCount
  const manualToGovernedRatio = governedCount > 0
    ? Math.round((manualCount / governedCount) * 100) / 100
    : null

  return {
    totalEvents: filtered.length,
    byAgent,
    byStep,
    byAutonomyLevel: byAutonomy,
    byOutcome,
    avgDurationMsByActivity: avgDurationByActivity,
    manualToGovernedRatio,
  }
}

// ── GitHub API collector ─────────────────────────────────────────────────────

async function collectGitHubMetrics(owner, repoName, ghToken, since) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Authorization': `Bearer ${ghToken}`,
  }

  const base = `https://api.github.com/repos/${owner}/${repoName}`

  async function ghGet(path) {
    try {
      const res = await fetch(`${base}${path}`, { headers })
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }

  const sinceISO = since.toISOString()

  // Issues closed in period
  const issues = await ghGet(`/issues?state=closed&since=${sinceISO}&per_page=100`)
  let issueCloseTimesAvgHours = null
  if (Array.isArray(issues) && issues.length > 0) {
    const closeTimes = issues
      .filter(i => i.created_at && i.closed_at)
      .map(i => (new Date(i.closed_at) - new Date(i.created_at)) / (1000 * 3600))
    if (closeTimes.length > 0) {
      issueCloseTimesAvgHours = Math.round(
        (closeTimes.reduce((s, t) => s + t, 0) / closeTimes.length) * 10
      ) / 10
    }
  }

  // PR merge times
  const pulls = await ghGet(`/pulls?state=closed&sort=updated&direction=desc&per_page=50`)
  let prMergeTimesAvgHours = null
  if (Array.isArray(pulls) && pulls.length > 0) {
    const mergeTimes = pulls
      .filter(p => p.merged_at && p.created_at && new Date(p.merged_at) >= since)
      .map(p => (new Date(p.merged_at) - new Date(p.created_at)) / (1000 * 3600))
    if (mergeTimes.length > 0) {
      prMergeTimesAvgHours = Math.round(
        (mergeTimes.reduce((s, t) => s + t, 0) / mergeTimes.length) * 10
      ) / 10
    }
  }

  // Workflow run success rate
  const runs = await ghGet(`/actions/runs?status=completed&per_page=100`)
  let workflowSuccessRate = null
  if (runs && Array.isArray(runs.workflow_runs)) {
    const recent = runs.workflow_runs.filter(r => new Date(r.created_at) >= since)
    if (recent.length > 0) {
      const successes = recent.filter(r => r.conclusion === 'success').length
      workflowSuccessRate = Math.round((successes / recent.length) * 1000) / 10
    }
  }

  return {
    issueCloseTimesAvgHours,
    prMergeTimesAvgHours,
    workflowSuccessRate,
    issueCount: Array.isArray(issues) ? issues.length : null,
    prCount: Array.isArray(pulls)
      ? pulls.filter(p => p.merged_at && new Date(p.merged_at) >= since).length
      : null,
  }
}

// ── Report builder ────────────────────────────────────────────────────────────

async function buildReport() {
  // Source 1: audit events
  const auditDir = join(frameworkRoot, 'audit', 'events')
  const rawEvents = scanAuditEvents(auditDir)
  const auditAgg = aggregateAuditEvents(rawEvents, periodStart)

  // Source 2: GitHub API (optional)
  let githubMetrics = null
  if (token && repo) {
    const [owner, repoName] = repo.split('/')
    if (owner && repoName) {
      console.log(`  Fetching GitHub metrics for ${repo}…`)
      githubMetrics = await collectGitHubMetrics(owner, repoName, token, periodStart)
    }
  } else {
    console.log('  GitHub API skipped (no --token provided)')
  }

  // Source 4: Maturity history from assessment files
  const assessmentDir = join(frameworkRoot, 'docs', 'assessment')
  const maturityHistory = []
  let latestMaturity = null

  if (existsSync(assessmentDir)) {
    const datedFiles = readdirSync(assessmentDir)
      .filter(f => f.match(/^\d{4}-\d{2}-\d{2}-readiness-assessment\.json$/))
      .sort()
    for (const file of datedFiles) {
      try {
        const a = JSON.parse(readFileSync(join(assessmentDir, file), 'utf8'))
        const score = a.overall?.score ?? a.overall_score ?? null
        const date = file.slice(0, 10)
        if (score != null) maturityHistory.push({ date, score, tier: a.overall?.tier ?? a.maturity_tier })
      } catch { /* skip malformed */ }
    }
  }

  const latestPath = join(assessmentDir, 'readiness-assessment.json')
  if (existsSync(latestPath)) {
    try {
      const a = JSON.parse(readFileSync(latestPath, 'utf8'))
      const score = a.overall?.score ?? a.overall_score ?? null
      const date = (a.assessedAt ?? a.generated_at ?? new Date().toISOString()).slice(0, 10)
      latestMaturity = { date, score, tier: a.overall?.tier ?? a.maturity_tier }
      if (score != null && !maturityHistory.find(h => h.date === date)) {
        maturityHistory.push({ date, score, tier: latestMaturity.tier })
      }
    } catch { /* skip */ }
  }
  maturityHistory.sort((a, b) => a.date.localeCompare(b.date))

  // Source 5: Framework maturity profile
  const { scoreMaturity } = await import('./maturity-scorer.mjs')
  const maturityProfile = await scoreMaturity(frameworkRoot)

  // Source 3: Framework adoption
  const adoption = await checkAdoption(frameworkRoot)
  const adoptionPercent = adoption.adoptionPercent ?? adoption.overall_percentage ?? 0

  const topAgents = Object.entries(auditAgg.byAgent)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([agent, count]) => ({ agent, count }))

  const report = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    period: {
      days: periodDays,
      from: periodStart.toISOString(),
      to: new Date().toISOString(),
    },
    repository: repo ?? frameworkRoot,
    auditEvents: {
      ...auditAgg,
      topAgents,
    },
    github: githubMetrics,
    adoption: {
      adoptionPercent,
      summary: adoption.summary,
      categories: Object.fromEntries(
        Object.entries(adoption.categories ?? {}).map(([k, v]) => [k, { score: v.score ?? v.adopted ?? 0, max: v.max ?? v.total ?? 0 }])
      ),
    },
    governanceHealth: deriveGovernanceHealth(auditAgg, adoption),
    maturityHistory,
    latestMaturity,
    maturityProfile,
  }

  return report
}

function deriveGovernanceHealth(auditAgg, adoption) {
  const governedRatio = auditAgg.manualToGovernedRatio
  const adoptionPct = adoption.adoptionPercent ?? adoption.overall_percentage ?? 0

  // Simple health score: blend of adoption % and governed activity ratio
  let score = adoptionPct
  if (governedRatio !== null) {
    // Lower ratio (fewer manual vs governed) → better
    const governancePenalty = Math.min(governedRatio * 10, 20)
    score = Math.max(0, score - governancePenalty)
  }

  let status = 'green'
  if (score < 40) status = 'red'
  else if (score < 70) status = 'amber'

  return { score: Math.round(score), status, adoptionPercent: adoptionPct, manualToGovernedRatio: governedRatio }
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════')
console.log('  Agentic Engineering Framework — Metrics Collector')
console.log('══════════════════════════════════════════════════════════')
console.log(`  Period:    last ${periodDays} days (since ${periodStart.toISOString().slice(0, 10)})`)
console.log(`  Output:    ${outputDir}`)
if (repo) console.log(`  Repo:      ${repo}`)
console.log('')

const report = await buildReport()

mkdirSync(outputDir, { recursive: true })

const date = new Date().toISOString().slice(0, 10)
const datedFile = join(outputDir, `${date}.json`)
const latestFile = join(outputDir, 'latest.json')

const content = JSON.stringify(report, null, 2) + '\n'
writeFileSync(datedFile, content, 'utf8')
writeFileSync(latestFile, content, 'utf8')  // copy, not symlink (Windows compat)

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`  Total events:     ${report.auditEvents.totalEvents}`)
if (report.auditEvents.topAgents.length > 0) {
  console.log('  Top agents:')
  for (const { agent, count } of report.auditEvents.topAgents) {
    console.log(`    • ${agent}: ${count}`)
  }
} else {
  console.log('  Top agents:       (no audit events found)')
}
console.log(`  Adoption:         ${report.adoption.adoptionPercent}%`)
console.log(`  Governance health: ${report.governanceHealth.status.toUpperCase()} (${report.governanceHealth.score}/100)`)
if (report.github) {
  console.log(`  Issues closed:    ${report.github.issueCount ?? 'n/a'}`)
  console.log(`  PR merge time:    ${report.github.prMergeTimesAvgHours ?? 'n/a'} hrs avg`)
  console.log(`  Workflow success: ${report.github.workflowSuccessRate ?? 'n/a'}%`)
}
console.log('──────────────────────────────────────────────────────────')
console.log(`  Written: ${datedFile}`)
console.log(`  Written: ${latestFile}`)
console.log('══════════════════════════════════════════════════════════\n')
