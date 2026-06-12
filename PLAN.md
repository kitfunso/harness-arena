# HarnessArena — Built in London hackathon (2026-06-12)

State file. Deadline: submit 4:00 PM at community.vercel.com/hackathon/built-in-london (password: shiplondon).
Submission needs: <=90s YouTube video, live deploy link, team names, tech list.

## Concept
Competitive arena for AI coding harnesses. Same task, different harness (CLI/scaffold/prompts) -> who ships first
and passes the hidden test suite. Leaderboard + side-by-side race replay from real recorded traces.
Angle: harness > model; benchmarks hide the harness. We measure it.

## Architecture (static HTML per Thariq "Unreasonable Effectiveness of HTML" — no framework, no build)
- index.html        single-file UI: leaderboard, tasks, race replay (vanilla JS, dark theme)
- data/runs.json    array of run records (real runs only, NO fabricated data)
- data/traces/*.json {run, events:[{t,s,x}]} per run -> powers replay
- runner/run.mjs    wraps any agent CLI: copies task workspace to temp dir, times it, scores vs hidden tests
- tasks/{csv-parser,rate-limiter,md-table}/ README.md (agent-visible spec) + workspace/impl.mjs (stub) + test.mjs (hidden)

## Runner usage
node runner/run.mjs --task tasks/csv-parser --harness codex-cli --model gpt-5.5 --cmd "codex exec --full-auto --cd {ws} {prompt}"

## Status
- [x] tasks x3 written, hidden suites verified (refsol 100%, stubs fail)
- [x] runner written + validated end-to-end (3 reference-human baseline runs recorded)
- [x] index.html UI live, checked in browser on :8123
- [x] git repo, 2 commits
- [ ] seed real agent runs - codex csv-parser IN FLIGHT (bw1a2nv20)
      NOTE: must call codex via direct binary: node %APPDATA%\npm\node_modules\@openai\codex\bin\codex.js
      (hippo wrapper codex.cmd breaks under cmd.exe spawn - fix belongs in hippo, tracked)
- [ ] more seeds: codex low-effort variant (same task = race demo), codex x2 other tasks, maybe 1 claude haiku
- [ ] deploy: npx vercel (NOT logged in yet - Keith must run: npx vercel login)
- [ ] video 90s + submit by 3:45 at community.vercel.com/hackathon/built-in-london (password shiplondon)

## Constraints
- Claude token budget ~15% left -> no sub-agent fan-out, no dev-framework-rl, write-once files
- Codex runs burn OpenAI credit (separate budget) -> prefer Codex for seeding
