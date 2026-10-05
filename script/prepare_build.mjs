import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const removablePaths = [
  '.next',
  '.vinext',
  '.wrangler',
  'coverage',
  'dist',
  'out',
  'outputs',
  'work',
  '.vercel',
  '.pnpm-store',
  'node_modules',
  'app/data.ts',
  'app/skills/data.ts',
  'app/skills/skill-combos.ts',
  'app/attributes/data.ts',
  'app/boosters/data.ts',
  'csv/play_skill_rec_by_expert.csv',
  'next-env.d.ts',
  'tsconfig.tsbuildinfo',
];

function remove(relativePath) {
  const target = path.join(ROOT, relativePath);
  if (!existsSync(target)) return;
  rmSync(target, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200,
  });
  console.log(`已清理：${relativePath}`);
}

for (const relativePath of removablePaths) remove(relativePath);

const publicSkillsDir = path.join(ROOT, 'public', 'skills');
if (existsSync(publicSkillsDir)) {
  for (const file of readdirSync(publicSkillsDir)) {
    if (!/^\d{2}\.webp$/.test(file)) continue;
    remove(path.join('public', 'skills', file));
  }
}

function runNpm(...args) {
  execFileSync(npmCommand, args, { cwd: ROOT, stdio: 'inherit' });
}

console.log('开始重新安装依赖：npm ci');
runNpm('ci');
runNpm('run', 'normalize:data');
runNpm('run', 'generate:data');
runNpm('run', 'convert:skills');
console.log('构建准备完成。');
