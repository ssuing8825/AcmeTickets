/**
 * check-adoption.mjs
 *
 * Scans the framework repo and produces a framework-adoption snapshot JSON.
 *
 * Usage:
 *   node scripts/check-adoption.mjs [--output metrics/]
 *
 * Exports:
 *   checkAdoption(repoPath) → adoption object (for use by collect-metrics.mjs)
 */

import { existsSync, readdirSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const frameworkRoot = resolve(__dirname, '..')

// ── Helpers ──────────────────────────────────────────────────────────────────

function listFiles(dir, ext) {
  if (!existsSync(dir)) return []
  try {
    return readdirSync(dir).filter(f => !ext || f.endsWith(ext))
  } catch {
    return []
  }
}

function listFilesRecursive(dir, ext) {
  if (!existsSync(dir)) return []
  const results = []
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        results.push(...listFilesRecursive(full, ext))
      } else if (!ext || entry.name.endsWith(ext)) {
        results.push(full)
      }
    }
  } catch { /* ignore */ }
  return results
}

function dirExists(dir) {
  return existsSync(dir)
}

// ── Core adoption checker ─────────────────────────────────────────────────────

export async function checkAdoption(repoPath) {
  const root = resolve(repoPath)

  function p(...parts) { return join(root, ...parts) }
  function exists(rel) { return existsSync(p(rel)) }
  function files(rel, ext) { return listFiles(p(rel), ext) }
  function filesRec(rel, ext) { return listFilesRecursive(p(rel), ext) }

  // ── config ───────────────────────────────────────────────────────────────
  const configItems = [
    { item: 'config/aispec.config.yaml', present: exists('config/aispec.config.yaml') },
  ]
  const configScore = configItems.filter(i => i.present).length
  const configMax = 1

  // ── agents ───────────────────────────────────────────────────────────────
  const agentFiles = files('framework/agents', '.yaml')
  const agentsScore = agentFiles.length
  const agentsMax = 16

  // ── skills ───────────────────────────────────────────────────────────────
  const skillFiles = files('framework/skills', '.yaml')
  const skillsScore = skillFiles.length
  const skillsMax = 9

  // ── governance ───────────────────────────────────────────────────────────
  const governanceItems = [
    { item: 'governance-registry.yaml', present: exists('governance-registry.yaml') },
    { item: 'docs/governance/summary-grid.json', present: exists('docs/governance/summary-grid.json') },
  ]
  const governanceScore = governanceItems.filter(i => i.present).length
  const governanceMax = 2

  // ── docs ─────────────────────────────────────────────────────────────────
  const docsItems = [
    { item: 'docs/extending/', present: dirExists(p('docs/extending')) },
    { item: 'docs/playbooks/', present: dirExists(p('docs/playbooks')) },
    { item: 'docs/sdlc/', present: dirExists(p('docs/sdlc')) },
    { item: 'docs/assessment/', present: dirExists(p('docs/assessment')) },
  ]
  const docsScore = docsItems.filter(i => i.present).length
  const docsMax = 4

  // ── tests ────────────────────────────────────────────────────────────────
  const testFiles = filesRec('tests', '.test.js')
  const testsScore = testFiles.length
  const testsMax = testsScore  // count-based, max = actual count

  // ── ci ───────────────────────────────────────────────────────────────────
  const ciItems = [
    { item: '.github/workflows/validate-schemas.yml', present: exists('.github/workflows/validate-schemas.yml') },
    { item: '.github/workflows/test.yml', present: exists('.github/workflows/test.yml') },
    { item: '.github/workflows/deploy-pages.yml', present: exists('.github/workflows/deploy-pages.yml') },
  ]
  const ciScore = ciItems.filter(i => i.present).length
  const ciMax = 3

  // ── playbooks ────────────────────────────────────────────────────────────
  const playbookFiles = filesRec('.specify/prompts').filter(f => {
    const name = f.replace(/\\/g, '/').split('/').pop()
    return name.startsWith('brownfield.') && name.endsWith('.md')
  })
  const playbooksScore = playbookFiles.length
  const playbooksMax = playbooksScore  // count-based

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalPresent = configScore + agentsScore + skillsScore + governanceScore + docsScore + testsScore + ciScore + playbooksScore
  const totalMax = configMax + agentsMax + skillsMax + governanceMax + docsMax + (testsMax || 0) + ciMax + (playbooksMax || 0)
  const adoptionPct = totalMax > 0 ? Math.round((totalPresent / totalMax) * 100) : 0

  function categoryShape(adopted, total) {
    return {
      adopted,
      total,
      percentage: total > 0 ? Math.round((adopted / total) * 100) : 0,
    }
  }

  return {
    generated_at: new Date().toISOString(),
    repo: root,
    overall_percentage: adoptionPct,
    // Extended fields for CLI output and collect-metrics.mjs
    summary: { totalPresent, totalMax },
    categories: {
      config:     categoryShape(configScore,     configMax),
      agents:     categoryShape(agentsScore,     agentsMax),
      skills:     categoryShape(skillsScore,     skillsMax),
      governance: categoryShape(governanceScore, governanceMax),
      docs:       categoryShape(docsScore,       docsMax),
      tests:      categoryShape(testsScore,      testsMax || 0),
      ci:         categoryShape(ciScore,         ciMax),
      playbooks:  categoryShape(playbooksScore,  playbooksMax || 0),
    },
  }
}

// ── CLI Entry Point ──────────────────────────────────────────────────────────

const args = process.argv.slice(2)
function getArg(flag) {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const outputDir = getArg('--output') ?? join(frameworkRoot, 'metrics')
const repoPath = frameworkRoot

const adoption = await checkAdoption(repoPath)

const date = new Date().toISOString().slice(0, 10)
const outFile = join(outputDir, `adoption-${date}.json`)

mkdirSync(outputDir, { recursive: true })
writeFileSync(outFile, JSON.stringify(adoption, null, 2) + '\n', 'utf8')

console.log('\n══════════════════════════════════════════════════════════')
console.log('  Framework Adoption Check')
console.log('══════════════════════════════════════════════════════════')
console.log(`  Adoption:  ${adoption.overall_percentage}%  (${adoption.summary.totalPresent}/${adoption.summary.totalMax} items)`)
console.log('')
for (const [cat, data] of Object.entries(adoption.categories)) {
  const bar = '█'.repeat(data.total > 0 ? Math.round((data.adopted / data.total) * 10) : 0).padEnd(10, '░')
  console.log(`  ${cat.padEnd(12)} ${bar}  ${data.adopted}/${data.total}`)
}
console.log('──────────────────────────────────────────────────────────')
console.log(`  Written: ${outFile}`)
console.log('══════════════════════════════════════════════════════════\n')
