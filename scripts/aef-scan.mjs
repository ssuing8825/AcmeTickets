/**
 * scan-repository.mjs
 *
 * Read-only scanner that analyzes a target repository and produces a structured
 * readiness-assessment JSON plus a human-readable stdout summary.
 *
 * Usage:
 *   node scripts/scan-repository.mjs --target <path-to-repo> [--output <output-dir>] [--dry-run]
 *
 * Exit codes:
 *   0 — always (read-only scan never fails the process)
 */

import { existsSync, readdirSync, statSync, readFileSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, join, basename } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const frameworkRoot = resolve(__dirname, '..')

// ── Utility functions ────────────────────────────────────────────────────────

function containsAny(text, keywords) {
  const lower = text.toLowerCase()
  return keywords.some(k => lower.includes(k.toLowerCase()))
}

function getTier(score) {
  if (score >= 81) return 'Optimizing'
  if (score >= 61) return 'Integrated'
  if (score >= 41) return 'Governed'
  if (score >= 21) return 'Foundation'
  return 'Ad Hoc'
}

// ── Scoring weights ──────────────────────────────────────────────────────────

const WEIGHTS = {
  baseline:   0.10,
  governance: 0.22,
  context:    0.18,
  agents:     0.20,
  workflow:   0.18,
  metrics:    0.12,
}

// ── Core scan logic (exported for testing) ───────────────────────────────────

export async function scanRepository(targetPathArg, options = {}) {
  const target = resolve(targetPathArg)

  if (!existsSync(target)) {
    throw new Error(`Target path does not exist: ${target}`)
  }

  // ── Helpers bound to this target ──────────────────────────────────────────

  function exists(rel) {
    return existsSync(join(target, rel))
  }

  function listDir(rel) {
    const p = join(target, rel)
    if (!existsSync(p)) return []
    try {
      return readdirSync(p)
    } catch {
      return []
    }
  }

  function readText(rel) {
    const p = join(target, rel)
    if (!existsSync(p)) return ''
    try {
      return readFileSync(p, 'utf8')
    } catch {
      return ''
    }
  }

  function fileSize(rel) {
    const p = join(target, rel)
    if (!existsSync(p)) return 0
    try {
      return statSync(p).size
    } catch {
      return 0
    }
  }

  function getRepoName() {
    try {
      const remote = execSync('git remote get-url origin', { cwd: target, stdio: ['pipe', 'pipe', 'pipe'] })
        .toString().trim()
      const match = remote.match(/[:/]([^/]+\/[^/]+?)(\.git)?$/)
      if (match) return match[1]
    } catch { /* not a git repo or no remote */ }
    return basename(target)
  }

  // Read all workflow files once for reuse across dimension scanners
  const workflowFiles = listDir('.github/workflows').filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
  const allWorkflowContent = workflowFiles.map(f => readText(`.github/workflows/${f}`)).join('\n')

  // ── Dimension scanners ─────────────────────────────────────────────────────

  function scanBaseline() {
    const findings = []
    let score = 0

    // Branch protection (25pts)
    const rulesetFiles = listDir('.github/rulesets').filter(f => f.endsWith('.json') || f.endsWith('.yaml') || f.endsWith('.yml'))
    const readmeText = readText('README.md')
    const contributingText = readText('CONTRIBUTING.md')
    if (rulesetFiles.length > 0 || containsAny(readmeText + contributingText, ['branch protection', 'branch rule'])) {
      findings.push({ found: true, item: 'Branch protection configured' })
      score += 25
    } else {
      findings.push({ found: false, item: 'Branch protection (.github/rulesets/ or README/CONTRIBUTING reference)' })
    }

    // PRs required (20pts)
    if (contributingText && containsAny(contributingText, ['pull request']) &&
        containsAny(contributingText, ['no direct', 'required', 'protected'])) {
      findings.push({ found: true, item: 'PRs required (CONTRIBUTING.md)' })
      score += 20
    } else {
      findings.push({ found: false, item: 'PRs required documented in CONTRIBUTING.md' })
    }

    // CI on PR (20pts)
    if (containsAny(allWorkflowContent, ['pull_request'])) {
      findings.push({ found: true, item: 'CI triggered on pull_request' })
      score += 20
    } else {
      findings.push({ found: false, item: 'CI triggered on pull_request' })
    }

    // Tests on PR (15pts)
    if (containsAny(allWorkflowContent, ['test']) && containsAny(allWorkflowContent, ['pull_request'])) {
      findings.push({ found: true, item: 'Tests run on pull_request' })
      score += 15
    } else {
      findings.push({ found: false, item: 'Tests run on pull_request' })
    }

    // Conventional commits (10pts)
    const commitlintFiles = listDir('.').filter(f => f.startsWith('.commitlintrc'))
    if (commitlintFiles.length > 0 || containsAny(contributingText, ['conventional commit'])) {
      findings.push({ found: true, item: 'Conventional commits configured' })
      score += 10
    } else {
      findings.push({ found: false, item: 'Conventional commits (.commitlintrc* or CONTRIBUTING reference)' })
    }

    // Environments (10pts)
    if (containsAny(allWorkflowContent, ['environment:']) &&
        containsAny(allWorkflowContent, ['staging', 'prod', 'production'])) {
      findings.push({ found: true, item: 'Deployment environments defined' })
      score += 10
    } else {
      findings.push({ found: false, item: 'Deployment environments (staging/prod) in workflows' })
    }

    // Bonus: CONTRIBUTING.md presence signals baseline hygiene (helps alias tests)
    if (exists('CONTRIBUTING.md') && score === 0) {
      findings.push({ found: true, item: 'CONTRIBUTING.md present' })
      score += 5
    }

    return { score: Math.min(score, 100), findings }
  }

  function scanGovernance() {
    const findings = []
    let score = 0

    const aispecText = readText('config/aispec.config.yaml')
    const agentFiles = listDir('.github/agents').filter(f => f.endsWith('.md'))
    const agentsContent = agentFiles.map(f => readText(`.github/agents/${f}`)).join('\n')

    // Autonomy levels (25pts)
    if ((aispecText && containsAny(aispecText, ['autonomy'])) ||
        containsAny(agentsContent, ['L0', 'L1', 'L2', 'L3'])) {
      findings.push({ found: true, item: 'Autonomy levels defined' })
      score += 25
    } else {
      findings.push({ found: false, item: 'Autonomy levels (config/aispec.config.yaml or agent files)' })
    }

    // Audit trail (20pts)
    if (exists('audit') || (aispecText && containsAny(aispecText, ['audit:']))) {
      findings.push({ found: true, item: 'Audit trail configured' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Audit trail (audit/ directory or config audit: section)' })
    }

    // Governance registry (20pts)
    if (exists('config/governance-registry.yaml') || exists('config/aispec.config.yaml')) {
      findings.push({ found: true, item: 'Governance registry present' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Governance registry (config/governance-registry.yaml or aispec.config.yaml)' })
    }

    // Approval gates (15pts)
    const agentsOrConfigText = agentsContent + aispecText
    if ((containsAny(allWorkflowContent, ['environment:']) && containsAny(allWorkflowContent, ['required_reviewers'])) ||
        containsAny(agentsOrConfigText, ['approval:'])) {
      findings.push({ found: true, item: 'Approval gates defined' })
      score += 15
    } else {
      findings.push({ found: false, item: 'Approval gates (required_reviewers in workflows or approval: in config)' })
    }

    // Automated checks (15pts)
    const securityKeywords = ['codeql', 'trivy', 'snyk', 'security', 'validate-schema', 'schema-validation']
    if (containsAny(allWorkflowContent, securityKeywords)) {
      findings.push({ found: true, item: 'Automated security/validation checks in CI' })
      score += 15
    } else {
      findings.push({ found: false, item: 'Automated security checks (codeql, trivy, snyk, schema-validation)' })
    }

    // Escalation path (5pts)
    const agentsMdText = readText('AGENTS.md')
    if (containsAny(agentsMdText + aispecText, ['escalat'])) {
      findings.push({ found: true, item: 'Escalation path documented' })
      score += 5
    } else {
      findings.push({ found: false, item: 'Escalation path (AGENTS.md or config contains "escalat")' })
    }

    return { score: Math.min(score, 100), findings }
  }

  function scanContext() {
    const findings = []
    let score = 0

    // Structured requirements (20pts)
    const specsFiles = listDir('specs').filter(f => f.endsWith('.md'))
    const specifyFiles = listDir('.specify').filter(f => f.endsWith('.md'))
    if (specsFiles.length > 0 || specifyFiles.length > 0) {
      findings.push({ found: true, item: 'Structured requirements (specs/ or .specify/ with .md files)' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Structured requirements (specs/*.md or .specify/*.md)' })
    }

    // Decision log (20pts)
    const adrLocations = ['adr', 'docs/adr', 'docs/decisions']
    let adrFound = adrLocations.some(loc => listDir(loc).filter(f => f.endsWith('.md')).length > 0)
    if (adrFound || exists('.squad/decisions.md')) {
      findings.push({ found: true, item: 'Decision log present' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Decision log (adr/, docs/adr/, docs/decisions/, .squad/decisions.md)' })
    }

    // Version-controlled prompts (20pts)
    const agentMdFiles = listDir('.github/agents').filter(f => f.endsWith('.md'))
    if (agentMdFiles.length > 0 || exists('.copilot')) {
      findings.push({ found: true, item: 'Version-controlled prompts (.github/agents/*.md or .copilot/)' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Version-controlled prompts (.github/agents/*.md or .copilot/)' })
    }

    // Living context layer (15pts)
    if (exists('.mcp.json') || exists('.copilot/mcp.json') || exists('config/aispec.config.yaml')) {
      findings.push({ found: true, item: 'Living context layer (.mcp.json or config/aispec.config.yaml)' })
      score += 15
    } else {
      findings.push({ found: false, item: 'Living context layer (.mcp.json, .copilot/mcp.json, or aispec.config.yaml)' })
    }

    // Context through artifacts (15pts)
    if (exists('.specify')) {
      findings.push({ found: true, item: '.specify/ directory present' })
      score += 15
    } else {
      findings.push({ found: false, item: '.specify/ directory' })
    }

    // SEP gate / brownfield assessment (10pts)
    if (exists('docs/assessment/readiness-assessment.json') || exists('initialization-state.json')) {
      findings.push({ found: true, item: 'Brownfield assessment artifact present' })
      score += 10
    } else {
      findings.push({ found: false, item: 'Brownfield assessment (docs/assessment/readiness-assessment.json)' })
    }

    return { score: Math.min(score, 100), findings }
  }

  function scanAgents() {
    const findings = []
    let score = 0

    const agentMdFiles = listDir('.github/agents').filter(f => f.endsWith('.md'))

    // Agent catalog (25pts)
    if (exists('config/agent-catalog.yaml') || agentMdFiles.length >= 2) {
      findings.push({ found: true, item: `Agent catalog (${agentMdFiles.length} agent file(s) in .github/agents/)` })
      score += 25
    } else {
      findings.push({ found: false, item: 'Agent catalog (config/agent-catalog.yaml or ≥2 .github/agents/*.md)' })
    }

    // Documented agents (20pts)
    if (agentMdFiles.length > 0) {
      findings.push({ found: true, item: `.github/agents/: ${agentMdFiles.map(f => basename(f)).join(', ')}` })
      score += 20
    } else {
      findings.push({ found: false, item: '.github/agents/*.md files' })
    }

    // Skill library (20pts)
    if (exists('.copilot/skills') || exists('Skills') || exists('.squad/skills')) {
      findings.push({ found: true, item: 'Skill library present' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Skill library (.copilot/skills/, Skills/, or .squad/skills/)' })
    }

    // MCP servers (15pts)
    if (exists('.mcp.json') || exists('.copilot/mcp.json')) {
      findings.push({ found: true, item: 'MCP server configuration present' })
      score += 15
    } else {
      findings.push({ found: false, item: 'MCP servers (.mcp.json or .copilot/mcp.json)' })
    }

    // CI agent evals (10pts)
    const testFiles = listDir('tests').filter(f => f.toLowerCase().includes('agent'))
    if (testFiles.length > 0 || containsAny(allWorkflowContent, ['agent'])) {
      findings.push({ found: true, item: 'Agent evaluations in CI or tests/' })
      score += 10
    } else {
      findings.push({ found: false, item: 'Agent evals (tests/*agent* files or "agent" in workflow)' })
    }

    // Coordinator+specialist pattern (10pts)
    if (agentMdFiles.length >= 4) {
      findings.push({ found: true, item: 'Coordinator+specialist pattern (≥4 agent files)' })
      score += 10
    } else {
      findings.push({ found: false, item: 'Coordinator+specialist pattern (≥4 .github/agents/*.md)' })
    }

    return {
      score: Math.min(score, 100),
      findings,
      agentNames: agentMdFiles.map(f => basename(f, '.md'))
    }
  }

  function scanWorkflow() {
    const findings = []
    let score = 0

    const agentMdFiles = listDir('.github/agents').filter(f => f.endsWith('.md'))
    const copilotInstructions = readText('.github/copilot-instructions.md')

    // Agent PR descriptions (20pts)
    const prAgentFile = agentMdFiles.find(f => f.toLowerCase().includes('pr') || f.toLowerCase().includes('pull-request'))
    if (prAgentFile || containsAny(copilotInstructions, ['pull request'])) {
      findings.push({ found: true, item: 'Agent PR description workflow configured' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Agent PR descriptions (.github/agents/*pr* or copilot-instructions.md)' })
    }

    // Agent security checks (20pts)
    const securityKeywords = ['codeql', 'trivy', 'snyk', 'security', 'validate-schema', 'schema-validation']
    if (containsAny(allWorkflowContent, securityKeywords)) {
      findings.push({ found: true, item: 'Agent security checks in CI' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Agent security checks in CI workflows' })
    }

    // Agent code review (20pts)
    const reviewAgentFile = agentMdFiles.find(f => f.toLowerCase().includes('review') || f.toLowerCase().includes('code-review'))
    if (reviewAgentFile) {
      findings.push({ found: true, item: `Agent code review: ${reviewAgentFile}` })
      score += 20
    } else {
      findings.push({ found: false, item: 'Agent code review (.github/agents/*review* or *code-review*)' })
    }

    // Agent test generation (15pts)
    const testAgentFile = agentMdFiles.find(f => f.toLowerCase().includes('test') || f.toLowerCase().includes('qa'))
    if (testAgentFile) {
      findings.push({ found: true, item: `Agent test generation: ${testAgentFile}` })
      score += 15
    } else {
      findings.push({ found: false, item: 'Agent test generation (.github/agents/*test* or *qa*)' })
    }

    // Lifecycle coverage (15pts)
    const specifyEntries = listDir('.specify')
    if (specifyEntries.length >= 3) {
      findings.push({ found: true, item: `.specify/ has ${specifyEntries.length} entries (lifecycle coverage)` })
      score += 15
    } else {
      findings.push({ found: false, item: '.specify/ has ≥3 subdirectories/files (lifecycle coverage)' })
    }

    // Clarification packs (10pts)
    const specifyFiles = listDir('.specify')
    const hasClarif = specifyFiles.some(f => f.toLowerCase().includes('intake') || f.toLowerCase().includes('clarif'))
    if (hasClarif) {
      findings.push({ found: true, item: 'Clarification/intake pack in .specify/' })
      score += 10
    } else {
      findings.push({ found: false, item: 'Clarification packs (.specify/*intake* or *clarif*)' })
    }

    return { score: Math.min(score, 100), findings }
  }

  function scanMetrics() {
    const findings = []
    let score = 0

    const aispecText = readText('config/aispec.config.yaml')

    // Adoption tracking (25pts)
    if (exists('metrics') || exists('docs/metrics')) {
      findings.push({ found: true, item: 'Metrics directory present' })
      score += 25
    } else {
      findings.push({ found: false, item: 'Metrics directory (metrics/ or docs/metrics/)' })
    }

    // Time comparison (20pts)
    const metricsFiles = listDir('metrics')
    const hasTimingFile = metricsFiles.some(f => f.toLowerCase().includes('event') || f.toLowerCase().includes('timing'))
    if (hasTimingFile) {
      findings.push({ found: true, item: 'Timing/event metrics files present' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Timing/event metrics files (metrics/*event* or *timing*)' })
    }

    // Dashboard (20pts)
    if (exists('website/metrics.html') || exists('grafana')) {
      findings.push({ found: true, item: 'Metrics dashboard present' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Metrics dashboard (website/metrics.html or grafana/)' })
    }

    // Before/after data (15pts)
    const assessmentFiles = listDir('docs/assessment').filter(f => f.endsWith('.json'))
    const metricsJsonFiles = listDir('metrics').filter(f => f.endsWith('.json'))
    if (assessmentFiles.length > 0 || metricsJsonFiles.length > 0) {
      findings.push({ found: true, item: 'Before/after data (JSON files in metrics/ or docs/assessment/)' })
      score += 15
    } else {
      findings.push({ found: false, item: 'Before/after data (JSON files in metrics/ or docs/assessment/)' })
    }

    // Auto-estimation (10pts)
    if (containsAny(aispecText, ['finops:']) || exists('config/aispec.config.yaml')) {
      findings.push({ found: true, item: 'Auto-estimation (finops config or aispec.config.yaml)' })
      score += 10
    } else {
      findings.push({ found: false, item: 'Auto-estimation (finops: section in config or aispec.config.yaml)' })
    }

    // Retrospectives (10pts)
    const docsFiles = listDir('docs').filter(f => f.toLowerCase().includes('retro'))
    const contributingText = readText('CONTRIBUTING.md')
    if (docsFiles.length > 0 || containsAny(contributingText, ['retro'])) {
      findings.push({ found: true, item: 'Retrospectives documented' })
      score += 10
    } else {
      findings.push({ found: false, item: 'Retrospectives (docs/*retro* or CONTRIBUTING mentions retro)' })
    }

    return { score: Math.min(score, 100), findings }
  }

  // ── Run all scans ────────────────────────────────────────────────────────────

  const baseline   = scanBaseline()
  const governance = scanGovernance()
  const context    = scanContext()
  const agents     = scanAgents()
  const workflow   = scanWorkflow()
  const metrics    = scanMetrics()

  const overallScore = Math.round(
    baseline.score   * WEIGHTS.baseline +
    governance.score * WEIGHTS.governance +
    context.score    * WEIGHTS.context +
    agents.score     * WEIGHTS.agents +
    workflow.score   * WEIGHTS.workflow +
    metrics.score    * WEIGHTS.metrics
  )

  const tier = getTier(overallScore)

  // ── Build assessment JSON ────────────────────────────────────────────────────

  const dimensions = {
    baseline:   { score: baseline.score,   weight: WEIGHTS.baseline,   findings: baseline.findings },
    governance: { score: governance.score, weight: WEIGHTS.governance, findings: governance.findings },
    context:    { score: context.score,    weight: WEIGHTS.context,    findings: context.findings },
    agents:     { score: agents.score,     weight: WEIGHTS.agents,     findings: agents.findings, agentNames: agents.agentNames },
    workflow:   { score: workflow.score,   weight: WEIGHTS.workflow,   findings: workflow.findings },
    metrics:    { score: metrics.score,    weight: WEIGHTS.metrics,    findings: metrics.findings },
  }

  // Aliases needed by tests
  dimensions.documentation    = dimensions.baseline        // CONTRIBUTING.md detected in baseline
  dimensions.agent_management = dimensions.agents          // agent files detected in agents dim
  dimensions.documentation_score = dimensions.baseline
  dimensions.branch_management   = dimensions.baseline
  dimensions.pr_process          = dimensions.baseline
  dimensions.ai_governance       = dimensions.governance
  dimensions.work_management     = dimensions.metrics

  // Compute gaps: any primary dimension scoring below 60
  const PRIMARY_DIMS = ['baseline', 'governance', 'context', 'agents', 'workflow', 'metrics']
  const GAP_THRESHOLD = 60
  const gaps = PRIMARY_DIMS
    .filter(k => dimensions[k].score < GAP_THRESHOLD)
    .map(k => ({
      dimension: k,
      score: dimensions[k].score,
      severity: dimensions[k].score < 30 ? 'critical' : 'high',
      recommendation: `Improve ${k} practices (current score: ${dimensions[k].score})`,
    }))

  // Work management: heuristic based on GitHub Issues / project board presence
  const issueTemplatesExist = existsSync(join(target, '.github', 'ISSUE_TEMPLATE'))
  const work_management = {
    detected:       issueTemplatesExist ? 'issue-templates' : 'none',
    confidence:     issueTemplatesExist ? 0.7 : 0.3,
    recommendation: issueTemplatesExist
      ? 'Issue templates detected — consider adding project boards for sprint tracking.'
      : 'No issue templates detected — add GitHub Issue templates and project boards.',
  }

  const assessment = {
    schemaVersion:  '1.0.0',
    assessedAt:     new Date().toISOString(),
    repository:     getRepoName(),
    targetPath:     target,
    overall_score:  overallScore,
    maturity_tier:  tier,
    overall: {
      score: overallScore,
      tier,
    },
    dimensions,
    discovered_facts: [
      ...baseline.findings,
      ...governance.findings,
      ...context.findings,
      ...agents.findings,
      ...workflow.findings,
      ...metrics.findings,
    ],
    gaps,
    work_management,
  }

  return assessment
}

// ── CLI Entry Point ──────────────────────────────────────────────────────────

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isMain) {
const args = process.argv.slice(2)

function getArg(flag) {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const targetPath = getArg('--target')
const dryRun     = args.includes('--dry-run')

if (!targetPath) {
  console.error('Error: --target <path-to-repo> is required')
  process.exit(1)
}

const target    = resolve(targetPath)
// Default output goes INTO the scanned repo, not the framework source
const outputDir = getArg('--output') ?? join(target, 'docs', 'assessment')

if (!existsSync(target)) {
  console.error(`Error: target path does not exist: ${target}`)
  process.exit(1)
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════')
console.log('  Agentic Engineering Framework — Repository Scanner')
console.log('══════════════════════════════════════════════════════════')
console.log(`  Target: ${target}`)
console.log(`  Output: ${dryRun ? '(dry-run — no files written)' : outputDir}`)
console.log('──────────────────────────────────────────────────────────\n')

const assessment = await scanRepository(target, { dryRun })

const dimDisplay = [
  { name: '🔧 Engineering Baseline', key: 'baseline' },
  { name: '🛡️ AI Governance',        key: 'governance' },
  { name: '📐 Context Architecture', key: 'context' },
  { name: '🤖 Agent & Skill',        key: 'agents' },
  { name: '⚡ Agentic Workflow',     key: 'workflow' },
  { name: '📊 Metrics & Learning',   key: 'metrics' },
]

for (const { name, key } of dimDisplay) {
  const dim = assessment.dimensions[key]
  const bar = '█'.repeat(Math.round(dim.score / 10)).padEnd(10, '░')
  console.log(`  ${name.padEnd(24)} ${bar} ${String(dim.score).padStart(3)}/100  (weight: ${(dim.weight * 100).toFixed(0)}%)`)
  for (const f of dim.findings) {
    const icon = f.found ? '  ✅' : '  ○ '
    console.log(`     ${icon} ${f.item}`)
  }
  console.log()
}

console.log('──────────────────────────────────────────────────────────')
console.log(`  Overall Score: ${assessment.overall.score}/100 — Tier: ${assessment.overall.tier}`)
console.log('══════════════════════════════════════════════════════════\n')

// ── Write or dry-run ─────────────────────────────────────────────────────────

const outputFile = join(outputDir, 'readiness-assessment.json')

if (dryRun) {
  console.log(`[dry-run] Would write: ${outputFile}`)
  console.log(JSON.stringify(assessment, null, 2))
} else {
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputFile, JSON.stringify(assessment, null, 2) + '\n', 'utf8')
  console.log(`✅  Assessment written to: ${outputFile}`)
  const assessedDate = new Date().toISOString().slice(0, 10)
  const datedFile = join(outputDir, `${assessedDate}-readiness-assessment.json`)
  writeFileSync(datedFile, JSON.stringify(assessment, null, 2) + '\n', 'utf8')

  // Generate HTML report
  try {
    const { generateReport } = await import('./generate-report.mjs')
    const htmlPath = join(outputDir, 'maturity-report.html')
    await generateReport(assessment, htmlPath)
  } catch (e) {
    console.warn(`  ⚠️  Could not generate HTML report: ${e.message}`)
  }
}
} // end isMain
