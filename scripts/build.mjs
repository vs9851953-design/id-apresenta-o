/* ==========================================================
   Build da Vercel.
   1. Tenta regenerar assets/manifesto.json (falha não interrompe o build).
   2. Monta public/ apenas com os arquivos publicados do site.
   Sem dependências externas.
   ========================================================== */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const raiz = fileURLToPath(new URL('..', import.meta.url));

try {
  execFileSync(process.execPath, [join(raiz, 'scripts', 'gerar-manifesto.mjs')], { stdio: 'inherit' });
} catch {
  console.warn('Manifesto não regenerado; usando assets/manifesto.json existente.');
}

const destino = join(raiz, 'public');
rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });

for (const item of ['index.html', 'css', 'js', 'assets']) {
  const origem = join(raiz, item);
  if (existsSync(origem)) cpSync(origem, join(destino, item), { recursive: true });
}
console.log('public/ montado com o site.');
