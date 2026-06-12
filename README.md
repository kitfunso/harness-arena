# HarnessArena

**Same task. Same hidden test suite. Different harness. Who actually ships?**

Live board: **https://harness-arena-three.vercel.app** &middot; Demo video: [/video/harness-arena-demo.mp4](https://harness-arena-three.vercel.app/video/harness-arena-demo.mp4)

Benchmarks rank models. But in 2026 the *harness* - the prompts, tool loop, scaffolding, and recovery
logic wrapped around the model - moves agentic pass rates as much as the model does, and every public
leaderboard hides it. HarnessArena makes the harness the unit of competition.

Built at **Built in London** (Vercel + OpenAI hackathon), June 12 2026.

## How it works

1. Pick a task from `tasks/` - each has an agent-visible spec (`README.md`), a stub workspace, and a
   **hidden test suite** the agent never sees.
2. Race any CLI agent through the runner. It sandboxes the workspace, streams and timestamps every
   output line, then scores the result against the hidden suite:

```bash
node runner/run.mjs --task tasks/csv-parser --harness "my-codex-setup" --model gpt-5.5 \
  --cmd "codex exec --full-auto --cd {ws} {prompt}"
```

3. Every run is recorded to `data/runs.json` + a replayable trace in `data/traces/`.
4. `index.html` is the arena: leaderboard (correctness first, wall-clock second), task library, and a
   side-by-side **race replay** of any two recorded runs - the receipt for every number on the board.

## Honesty rules

- No synthetic rows. Every leaderboard entry is a real recorded run with its full trace.
- The hidden suite stays outside the agent sandbox; the visible spec contains only a sample of cases.
- `reference-human` rows are the scripted human reference solution - the upper bound to beat.

## Stack

Static HTML + vanilla JS (zero frameworks, zero build - the unreasonable effectiveness of HTML),
Node runner, deployed on Vercel.
