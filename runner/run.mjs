#!/usr/bin/env node
// HarnessArena runner: execute an agent harness against a task, score it, record a replayable trace.
// Usage:
//   node runner/run.mjs --task tasks/csv-parser --harness "codex-cli" --model "gpt-5.5" \
//     --cmd "codex exec --full-auto --cd {ws} {prompt}"
// {ws} -> temp workspace dir. {prompt} -> task README content (shell-quoted).
// The agent only sees the copied workspace; the hidden test suite stays outside it.

import { spawn } from 'node:child_process';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const taskDir = resolve(root, arg('task') ?? bail('missing --task'));
const harness = arg('harness') ?? bail('missing --harness');
const model = arg('model', '');
const cmdTemplate = arg('cmd') ?? bail('missing --cmd');
const notes = arg('notes', '');
const timeoutMs = Number(arg('timeout', 600)) * 1000;

function bail(msg) { console.error(msg); process.exit(2); }

const task = basename(taskDir);
const spec = readFileSync(join(taskDir, 'README.md'), 'utf8');
const ws = mkdtempSync(join(tmpdir(), `arena-${task}-`));
cpSync(join(taskDir, 'workspace'), ws, { recursive: true });

const promptQuoted = `"${spec.replace(/"/g, '\\"')}"`;
const cmd = cmdTemplate.replaceAll('{ws}', ws).replaceAll('{prompt}', promptQuoted);

const startedAt = new Date().toISOString();
const t0 = Date.now();
const events = [];
const MAX_EVENTS = 600;

function record(stream, chunk) {
  for (const line of chunk.toString().split(/\r?\n/)) {
    if (!line.trim() || events.length >= MAX_EVENTS) continue;
    events.push({ t: Date.now() - t0, s: stream, x: line.slice(0, 220) });
  }
}

console.log(`[arena] task=${task} harness=${harness}`);
console.log(`[arena] ws=${ws}`);
console.log(`[arena] cmd=${cmd.slice(0, 160)}...`);

const child = spawn(cmd, { shell: true, cwd: ws, env: { ...process.env, ARENA_WS: ws } });
let outputBytes = 0;
child.stdout.on('data', d => { outputBytes += d.length; record('out', d); });
child.stderr.on('data', d => { outputBytes += d.length; record('err', d); });

const killer = setTimeout(() => { console.log('[arena] TIMEOUT, killing'); child.kill('SIGKILL'); }, timeoutMs);

const exitCode = await new Promise(res => child.on('close', res));
clearTimeout(killer);
const durationMs = Date.now() - t0;

// Score against the hidden suite (runs from task dir, agent never saw it).
let passed = 0, total = 0, testOut = '';
await new Promise(res => {
  const t = spawn('node', [join(taskDir, 'test.mjs'), ws], { shell: false });
  t.stdout.on('data', d => testOut += d);
  t.stderr.on('data', d => testOut += d);
  t.on('close', res);
});
const m = testOut.match(/RESULT (\d+)\/(\d+)/);
if (m) { passed = Number(m[1]); total = Number(m[2]); }

// Best-effort token count from agent output (codex/claude print usage lines).
const allText = events.map(e => e.x).join('\n');
const tok = allText.match(/(?:tokens used|total tokens)[:\s]+([\d,]+)/i);
const tokensReported = tok ? Number(tok[1].replaceAll(',', '')) : null;

const id = `${task}--${harness.replace(/[^a-z0-9-]/gi, '_')}--${t0}`;
const run = {
  id, task, harness, model, startedAt, durationMs, passed, total,
  score: total ? +(passed / total).toFixed(3) : 0,
  exitCode, outputBytes, tokensReported, notes,
  cmd: cmdTemplate,
};

mkdirSync(join(root, 'data', 'traces'), { recursive: true });
writeFileSync(join(root, 'data', 'traces', `${id}.json`), JSON.stringify({ run, events }, null, 1));

const runsPath = join(root, 'data', 'runs.json');
const runs = existsSync(runsPath) ? JSON.parse(readFileSync(runsPath, 'utf8')) : [];
runs.push(run);
writeFileSync(runsPath, JSON.stringify(runs, null, 1));

console.log(`[arena] DONE ${task} ${harness}: ${passed}/${total} in ${(durationMs / 1000).toFixed(1)}s (exit ${exitCode})`);
console.log(testOut.trim());
