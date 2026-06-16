---
name: AEF Maturity Scanner
description: Scan repository for agentic engineering maturity and generate a dashboard

on:
  workflow_dispatch:
    inputs:
      commit_results:
        description: 'Create a PR with assessment results'
        type: boolean
        default: true

safe-outputs:
  create-pull-request:
    title-prefix: "[aef] "
    labels: [aef-assessment]
    draft: false
    if-no-changes: warn
---

# AEF Maturity Scanner

You are the Agentic Engineering Framework (AEF) brownfield scanner. Analyze this repository for agentic engineering maturity across 6 weighted dimensions, then write a structured JSON assessment and an HTML dashboard.

## Step 1 — Discover Repository Artifacts

Read the following files and note whether each exists and what it contains:

- `README.md`
- `CONTRIBUTING.md`
- `AGENTS.md`
- `package.json`
- `config/aispec.config.yaml`
- `.github/workflows/` — list all files, read CI and security workflows
- `.github/agents/` — list all files
- `.github/copilot-instructions.md`
- `.copilot/` — list directory contents
- `.squad/decisions.md` and `.squad/team.md`
- `adr/`, `docs/adr/`, `docs/decisions/` — check if any exist
- `specs/` or `.specify/` — check if exists and list contents
- `metrics/` — check if exists
- `audit/` — check if exists
- `config/` — list all files

## Step 2 — Score Each Dimension (0–100 each, cap at 100)

### Engineering Baseline (weight: 10%)
- Branch protection or rulesets referenced in README/CONTRIBUTING or `.github/rulesets/` → +25
- PR required before merging: CONTRIBUTING.md describes a PR workflow → +20
- CI runs on `pull_request` trigger: a workflow file has `pull_request:` → +20
- Automated tests in CI: workflow runs test commands → +15
- Conventional commits: `.commitlintrc*` exists or CONTRIBUTING mentions it → +10
- Environment separation: workflow uses `environment:` with staging/prod → +10

### AI Governance & Controls (weight: 22%)
- Autonomy level definitions: config has L0/L1/L2/L3 section or AGENTS.md defines levels → +25
- Audit trail: `audit/` directory or structured audit logging in CI → +20
- Governance registry: `config/governance-registry.yaml` or `config/aispec.config.yaml` with governance section → +20
- Approval gates: workflow uses `environment:` with protection rules → +15
- Automated governance checks: workflow has codeql, trivy, schema-validation, or security scanning → +15
- Escalation path: AGENTS.md or config mentions escalation → +5

### Spec-Driven Context Architecture (weight: 18%)
- Structured requirements: `specs/` or `.specify/` directory has `.md` files → +20
- Decision log: `adr/`, `docs/decisions/`, or `.squad/decisions.md` exists → +20
- Version-controlled agent prompts: `.github/agents/` has `.md` files or `.copilot/` exists → +20
- Living context layer: `.mcp.json`, `.copilot/mcp.json`, or config references MCP → +15
- Context artifacts: `specs/` has structured intake or clarification files → +15
- SEP intake gate: `docs/assessment/` or structured intake artifacts exist → +10

### Agent & Skill Lifecycle (weight: 20%)
- Agent catalog: `config/agent-catalog.yaml` or 3+ agent files in `.github/agents/` → +25
- Documented agent definitions: `.github/agents/` has markdown files → +20
- Skill library: `.copilot/skills/`, `.squad/skills/`, or dedicated skills directory → +20
- MCP configuration: `.mcp.json`, `.copilot/mcp.json`, or `mcp-config.json` → +15
- Agent evaluation in CI: test files mentioning "agent" or a workflow step for agent eval → +10
- Coordinator+specialist pattern: 4+ distinct agent role files in `.github/agents/` → +10

### Agentic Workflow Integration (weight: 18%)
- Agent-generated PR descriptions: agent file in `.github/agents/` targeting PRs → +20
- Agent security scanning: dedicated workflow or agent file for security → +20
- Agent code review: `.github/agents/` has a code review agent → +20
- Agent test generation: `.github/agents/` has a QA or test agent → +15
- Lifecycle coverage: `specs/` or `.specify/` covers 3+ SDLC phases → +15
- Clarification packs: spec files reference intake or clarification patterns → +10

### Metrics, Observability & Learning (weight: 12%)
- Adoption tracking: `metrics/` directory exists → +25
- Time or velocity data: files tracking throughput or cycle time → +20
- Dashboard: `website/` directory or existing `docs/assessment/maturity-report.html` → +20
- Before/after baseline data: `docs/assessment/readiness-assessment.json` → +15
- Auto-estimation artifacts: config mentions finops or estimation → +10
- Retrospective records: docs mention retro or sprint review → +10

## Step 3 — Calculate Overall Score

```
overall = round(
  baseline_score   * 0.10 +
  governance_score * 0.22 +
  context_score    * 0.18 +
  agents_score     * 0.20 +
  workflow_score   * 0.18 +
  metrics_score    * 0.12
)
```

Tier thresholds: 0–20 = **Ad Hoc** | 21–40 = **Foundation** | 41–60 = **Governed** | 61–80 = **Integrated** | 81–100 = **Optimizing**

## Step 4 — Identify Top Gaps

List the 3 lowest-scoring dimensions with one concrete, actionable recommendation each.

## Step 5 — Write Output Files

Create the directory `docs/assessment/` if it does not exist.

### File 1: `docs/assessment/readiness-assessment.json`

```json
{
  "schemaVersion": "1.0.0",
  "assessedAt": "<ISO 8601 timestamp>",
  "assessedBy": "aef-scan (gh-aw agent)",
  "repository": "<repository name from remote URL or directory basename>",
  "overall": {
    "score": 0,
    "tier": "<tier>"
  },
  "dimensions": {
    "baseline":   { "score": 0, "weight": 0.10, "label": "Engineering Baseline",             "findings": [{ "found": true, "item": "<description>" }] },
    "governance": { "score": 0, "weight": 0.22, "label": "AI Governance & Controls",         "findings": [] },
    "context":    { "score": 0, "weight": 0.18, "label": "Spec-Driven Context Architecture", "findings": [] },
    "agents":     { "score": 0, "weight": 0.20, "label": "Agent & Skill Lifecycle",          "findings": [] },
    "workflow":   { "score": 0, "weight": 0.18, "label": "Agentic Workflow Integration",     "findings": [] },
    "metrics":    { "score": 0, "weight": 0.12, "label": "Metrics, Observability & Learning","findings": [] }
  },
  "gaps": [
    { "dimension": "<key>", "score": 0, "severity": "critical", "recommendation": "<actionable recommendation>" }
  ]
}
```

Replace every `0` and `"<...>"` placeholder with actual values from your analysis.

### File 2: `docs/assessment/maturity-report.html`

Write a self-contained HTML file with no external dependencies:

- Dark theme: background `#0f1117`, surface `#161b22`, border `#30363d`, text `#e6edf3`
- Title: `AEF Maturity Assessment — [repo name]`
- Header showing repo name, scan date, `assessedBy`, and a tier badge
- Tier badge colours: Ad Hoc = `#f85149` (red), Foundation = `#d29922` (yellow), Governed = `#388bfd` (blue), Integrated = `#3fb950` (green), Optimizing = `#a371f7` (purple)
- Large score display (score/100 in large font, tier label below)
- 6 horizontal dimension bars with label, score percentage, and coloured fill: below 30 = `#f85149`, 30–59 = `#d29922`, 60–79 = `#388bfd`, 80+ = `#3fb950`
- Gaps table with dimension name, score, severity badge, and recommendation
- "Next Steps" section listing the top 3 gaps as numbered action items
- A "Scan again" note at the bottom: "Re-run AEF Maturity Scanner workflow to update this report"
- Print-friendly: include a `<button onclick="window.print()">Print Report</button>`
- The HTML must be completely standalone — no `<link>` or `<script src>` to external URLs

Make the layout clean, professional, and readable at 1200px wide.
