/**
 * generate-report.mjs
 *
 * Reads a readiness-assessment.json and generates a self-contained maturity-report.html.
 *
 * Usage:
 *   node scripts/generate-report.mjs [--assessment <path>] [--output <path>]
 *
 * Named export:
 *   generateReport(assessment, outputPath) => Promise<string>  (returns absolute output path)
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const frameworkRoot = resolve(__dirname, '..')

// ── Tier colors ───────────────────────────────────────────────────────────────

const TIER_COLORS = {
  'Ad Hoc':     '#e85b5b',
  'Foundation': '#e8b44b',
  'Governed':   '#7aa3f7',
  'Integrated': '#5bbf94',
  'Optimizing': '#c084fc',
}

function tierColor(tier) {
  return TIER_COLORS[tier] ?? '#7d8590'
}

function barColor(score) {
  if (score >= 80) return '#5bbf94'
  if (score >= 60) return '#7aa3f7'
  if (score >= 30) return '#e8b44b'
  return '#e85b5b'
}

// ── Next-step recommendations ─────────────────────────────────────────────────

const NEXT_STEPS = {
  baseline:   'Set up branch protection rules and require PR reviews',
  governance: 'Install the AEF framework: node scripts/initialize.mjs --target <repo>',
  context:    'Add a .specify/ directory and commit requirements before coding',
  agents:     'Add agent files to .github/agents/ and define a skill library',
  workflow:   'Configure agent PR descriptions and security checks in CI',
  metrics:    'Enable metrics collection: npm run collect-metrics -- --target <repo>',
}

const DIM_LABELS = {
  baseline:   '🔧 Engineering Baseline',
  governance: '🛡️ AI Governance & Controls',
  context:    '📐 Spec-Driven Context',
  agents:     '🤖 Agent & Skill Lifecycle',
  workflow:   '⚡ Agentic Workflow',
  metrics:    '📊 Metrics & Observability',
}

const PRIMARY_DIMS = ['baseline', 'governance', 'context', 'agents', 'workflow', 'metrics']

// ── HTML builder ──────────────────────────────────────────────────────────────

function buildHtml(assessment) {
  const { repository, assessedAt, overall_score, maturity_tier, dimensions, gaps } = assessment

  const score = overall_score ?? assessment.overall?.score ?? 0
  const tier  = maturity_tier ?? assessment.overall?.tier ?? 'Ad Hoc'
  const tc    = tierColor(tier)
  const date  = assessedAt ? new Date(assessedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'

  // Build dimension bars for primary dims only
  const dimBars = PRIMARY_DIMS.map(key => {
    const dim = dimensions?.[key]
    if (!dim) return ''
    const s = typeof dim === 'object' ? (dim.score ?? 0) : (dim ?? 0)
    const w = typeof dim === 'object' ? (dim.weight ?? 0) : 0
    const label = DIM_LABELS[key] ?? key
    const color = barColor(s)
    return `
      <div class="dim-row">
        <div class="dim-label">${label}</div>
        <div class="dim-bar-wrap">
          <div class="dim-bar" style="width:${s}%;background:${color}"></div>
        </div>
        <div class="dim-score">${s}/100</div>
        <div class="dim-weight">${(w * 100).toFixed(0)}%</div>
      </div>`
  }).join('')

  // Build gaps list
  const primaryGaps = (gaps ?? []).filter(g => PRIMARY_DIMS.includes(g.dimension))
  const gapItems = primaryGaps.length > 0
    ? primaryGaps.map(g => {
        const sev = g.severity === 'critical' ? '🔴' : '🟡'
        return `<li>${sev} <strong>${DIM_LABELS[g.dimension] ?? g.dimension}</strong> — score: ${g.score}/100</li>`
      }).join('\n')
    : '<li>No critical gaps detected — great work!</li>'

  // Build next steps (top 3 gaps)
  const topGaps = primaryGaps.slice(0, 3)
  const nextStepItems = topGaps.length > 0
    ? topGaps.map((g, i) => {
        const action = NEXT_STEPS[g.dimension] ?? `Improve ${g.dimension} practices`
        return `<li><span class="step-num">${i + 1}</span><div><strong>${DIM_LABELS[g.dimension] ?? g.dimension}</strong><br><span class="step-detail">${action}</span></div></li>`
      }).join('\n')
    : '<li><span class="step-num">✓</span><div><strong>All dimensions look good!</strong><br><span class="step-detail">Continue iterating and measuring adoption.</span></div></li>'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Maturity Report — ${escHtml(repository)}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0f1117;
    color: #e6edf3;
    min-height: 100vh;
    padding: 2rem 1rem;
  }
  .container { max-width: 860px; margin: 0 auto; }
  .header {
    text-align: center;
    padding: 2.5rem 2rem 2rem;
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }
  .header h1 { font-size: 1.1rem; color: #7d8590; margin-bottom: .5rem; font-weight: 400; }
  .header h2 { font-size: 1.8rem; font-weight: 700; color: #e6edf3; margin-bottom: 1.5rem; word-break: break-all; }
  .score-circle {
    display: inline-flex; flex-direction: column; align-items: center;
    background: #0f1117; border: 3px solid ${tc};
    border-radius: 50%; width: 130px; height: 130px;
    justify-content: center; margin: 0 auto 1.2rem;
  }
  .score-num { font-size: 2.8rem; font-weight: 800; color: ${tc}; line-height: 1; }
  .score-label { font-size: .75rem; color: #7d8590; margin-top: .2rem; }
  .tier-badge {
    display: inline-block;
    background: ${tc}22;
    color: ${tc};
    border: 1px solid ${tc};
    border-radius: 20px;
    padding: .35rem 1.2rem;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: .8rem;
  }
  .scan-date { color: #7d8590; font-size: .85rem; }
  .section {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .section h3 { font-size: 1rem; font-weight: 600; color: #e6edf3; margin-bottom: 1.2rem; border-bottom: 1px solid #30363d; padding-bottom: .6rem; }
  .dim-row { display: grid; grid-template-columns: 220px 1fr 60px 40px; align-items: center; gap: .5rem; margin-bottom: .75rem; }
  .dim-label { font-size: .85rem; color: #e6edf3; }
  .dim-bar-wrap { background: #0f1117; border-radius: 4px; height: 12px; overflow: hidden; }
  .dim-bar { height: 100%; border-radius: 4px; transition: width .3s; }
  .dim-score { font-size: .8rem; color: #e6edf3; text-align: right; }
  .dim-weight { font-size: .75rem; color: #7d8590; text-align: right; }
  .gaps-list { list-style: none; }
  .gaps-list li { padding: .5rem 0; border-bottom: 1px solid #30363d; font-size: .9rem; }
  .gaps-list li:last-child { border-bottom: none; }
  .next-steps { list-style: none; }
  .next-steps li { display: flex; gap: 1rem; align-items: flex-start; padding: .75rem 0; border-bottom: 1px solid #30363d; }
  .next-steps li:last-child { border-bottom: none; }
  .step-num {
    flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%;
    background: #21262d; border: 1px solid #30363d;
    font-size: .8rem; font-weight: 700; color: #e6edf3;
  }
  .step-detail { color: #7d8590; font-size: .85rem; margin-top: .2rem; font-family: 'SFMono-Regular', Consolas, monospace; }
  .footer { text-align: center; color: #7d8590; font-size: .8rem; padding: 1rem 0; }
  .footer code { background: #161b22; padding: .2rem .4rem; border-radius: 4px; font-size: .78rem; }
  .print-btn {
    display: block; margin: 0 auto 1.5rem;
    background: #21262d; border: 1px solid #30363d;
    color: #e6edf3; padding: .5rem 1.5rem;
    border-radius: 6px; cursor: pointer; font-size: .9rem;
  }
  .print-btn:hover { background: #30363d; }
  @media print {
    body { background: #fff; color: #000; }
    .print-btn { display: none; }
    .section, .header { border-color: #ccc; background: #fff; }
    .dim-bar-wrap { background: #eee; }
    .score-circle { border-color: #333; }
    .score-num, .tier-badge { color: #333; }
    .dim-label, .dim-score, .section h3, .header h2 { color: #000; }
    .scan-date, .dim-weight, .step-detail, .footer { color: #555; }
  }
</style>
</head>
<body>
<div class="container">

  <div class="header">
    <h1>AEF Maturity Report</h1>
    <h2>${escHtml(repository)}</h2>
    <div class="score-circle">
      <span class="score-num">${score}</span>
      <span class="score-label">/ 100</span>
    </div>
    <div class="tier-badge">${escHtml(tier)}</div>
    <div class="scan-date">Scanned: ${date}</div>
  </div>

  <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>

  <div class="section">
    <h3>📊 Dimension Scores</h3>
    ${dimBars}
  </div>

  <div class="section">
    <h3>⚠️ Gaps</h3>
    <ul class="gaps-list">
      ${gapItems}
    </ul>
  </div>

  <div class="section">
    <h3>🚀 Top Next Steps</h3>
    <ul class="next-steps">
      ${nextStepItems}
    </ul>
  </div>

  <div class="footer">
    <p>Generated by the <strong>Agentic Engineering Framework</strong></p>
    <p style="margin-top:.4rem">Learn more: <code>node scripts/initialize.mjs --help</code></p>
  </div>

</div>
</body>
</html>`
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Named export ──────────────────────────────────────────────────────────────

/**
 * @param {object} assessment  Parsed readiness-assessment JSON
 * @param {string} outputPath  Absolute path to write the HTML file
 * @returns {Promise<string>}  Absolute path to the written file
 */
export async function generateReport(assessment, outputPath) {
  const absPath = resolve(outputPath)
  mkdirSync(dirname(absPath), { recursive: true })
  const html = buildHtml(assessment)
  writeFileSync(absPath, html, 'utf8')
  console.log(`\n  ✅ Report: file://${absPath.replace(/\\/g, '/')}\n`)
  return absPath
}

// ── CLI Entry Point ───────────────────────────────────────────────────────────

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isMain) {
  const args = process.argv.slice(2)

  function getArg(flag) {
    const idx = args.indexOf(flag)
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
  }

  const assessmentArg = getArg('--assessment')
  const outputArg     = getArg('--output')

  const defaultAssessmentPath = join(frameworkRoot, 'docs', 'assessment', 'readiness-assessment.json')
  const assessmentPath = assessmentArg ? resolve(assessmentArg) : defaultAssessmentPath

  if (!existsSync(assessmentPath)) {
    console.error(`Error: assessment file not found: ${assessmentPath}`)
    console.error(`Run: node scripts/scan-repository.mjs --target <repo> first`)
    process.exit(1)
  }

  let assessment
  try {
    assessment = JSON.parse(readFileSync(assessmentPath, 'utf8'))
  } catch (e) {
    console.error(`Error: could not parse assessment JSON: ${e.message}`)
    process.exit(1)
  }

  const outputPath = outputArg
    ? resolve(outputArg)
    : join(dirname(assessmentPath), 'maturity-report.html')

  await generateReport(assessment, outputPath)
}
