import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Iniciando NexStock ERP (Backend + Frontend)...\n');

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
};

function startProcess(name, command, args, cwd, color) {
  const proc = spawn(command, args, {
    cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}${name}${colors.reset} ${line}`);
      }
    }
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${color}${name}${colors.reset} ${colors.red}${line}${colors.reset}`);
      }
    }
  });

  proc.on('close', (code) => {
    console.log(`${color}${name}${colors.reset} encerrado com código ${code}`);
  });

  return proc;
}

// Inicia Backend Express (Porta 3001)
const backend = startProcess(
  '[BACKEND] ',
  'npx',
  ['tsx', 'watch', 'src/server.ts'],
  path.join(rootDir, 'backend'),
  colors.cyan
);

// Inicia Frontend Vite (Porta 3000)
const frontend = startProcess(
  '[FRONTEND]',
  'npx',
  ['vite', '--port=3000', '--host=0.0.0.0'],
  path.join(rootDir, 'frontend'),
  colors.green
);

function cleanExit() {
  console.log('\n🛑 Encerrando backend e frontend...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit();
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
