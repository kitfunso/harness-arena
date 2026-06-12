// Scripted baseline "harness": applies the human reference solution to the workspace (cwd).
// Used to validate the arena pipeline and as the human upper-bound row on the leaderboard.
import { cpSync } from 'node:fs';

console.log('reading task spec...');
cpSync(process.env.ARENA_SRC, '.', { recursive: true });
console.log('reference solution applied to workspace');
