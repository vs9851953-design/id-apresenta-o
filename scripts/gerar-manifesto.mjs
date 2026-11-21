/* ==========================================================
   Gera assets/manifesto.json com a lista dos PNGs existentes
   em assets/img/. Roda no build da Vercel e manualmente:
     node scripts/gerar-manifesto.mjs
   Robusto a pastas ausentes (cria as pastas necessárias).
   Sem dependências externas.
   ========================================================== */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const pastaImagens = join(raiz, 'assets', 'img');
const subpastas = ['logos', 'rascunhos', 'tipografia', 'paleta', 'feed', 'stories', 'mockups'];

/* garante a estrutura de pastas mesmo que o repositório não tenha os .gitkeep */
for (const sub of subpastas) mkdirSync(join(pastaImagens, sub), { recursive: true });

function listar(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? listar(caminho) : [caminho];
  });
}

const imagens = listar(pastaImagens)
  .filter((f) => f.toLowerCase().endsWith('.png'))
  .map((f) => relative(raiz, f).split(sep).join('/'))
  .sort();

writeFileSync(
  join(raiz, 'assets', 'manifesto.json'),
  JSON.stringify({ gerado: new Date().toISOString(), imagens }, null, 2) + '\n'
);
console.log(`manifesto: ${imagens.length} imagem(ns) encontrada(s)`);
