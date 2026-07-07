/**
 * Retries `devvit playtest` on Windows when upload hits transient EBUSY locks
 * (Vite watch and Devvit upload racing on dist/client public assets).
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const devvitEntry = path.join(
  repoRoot,
  'node_modules',
  'devvit',
  'bin',
  'devvit.js'
);
const maxAttempts = 10;
const retryDelayMs = 3000;

const stopStaleDevProcesses = async () => {
  if (process.platform !== 'win32') {
    return;
  }

  await new Promise((resolve) => {
    const killer = spawn(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        [
          'Get-NetTCPConnection -LocalPort 5678 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }',
          "Get-CimInstance Win32_Process -Filter \"name='node.exe'\" | Where-Object { $_.CommandLine -match 'reigncraft.*(devvit|vite|retryDevvit)' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }",
        ].join('; '),
      ],
      { stdio: 'ignore' }
    );
    killer.on('close', () => resolve());
  });
};

const runPlaytest = () =>
  new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['--no-warnings=ExperimentalWarning', devvitEntry, 'playtest'],
      {
        cwd: repoRoot,
        env: process.env,
        stdio: 'inherit',
      }
    );
    child.on('close', (code) => resolve(code ?? 1));
  });

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  if (attempt > 1) {
    console.log(
      `Retrying playtest (${attempt}/${maxAttempts}) after EBUSY or port conflict...`
    );
    await stopStaleDevProcesses();
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  }

  const exitCode = await runPlaytest();
  if (exitCode === 0) {
    process.exit(0);
  }

  await stopStaleDevProcesses();
}

console.error(`devvit playtest failed after ${maxAttempts} attempts.`);
process.exit(1);
