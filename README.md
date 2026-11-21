# VTD DESIGN — Apresentação da identidade visual

Site estático em HTML, CSS e JavaScript puros. Não tem build com dependências, não usa framework e não depende de internet, exceto para o próprio domínio de publicação.

## Estrutura

```
index.html                       estrutura das 9 telas e da interface
css/apresentacao.css             estilos, layout e versão para celular e tablet em retrato
js/config.js                     textos, pastas e nomes dos PNGs (único arquivo a editar)
js/transicoes.js                 as 8 transições entre telas (reversíveis)
js/navegacao.js                  motor de navegação, galerias, teclado, roda, toque e tela cheia
assets/fonts/                    Varien e Montserrat Bold (do projeto Feed e Stories)
assets/manifesto.json            lista dos PNGs existentes (gerada automaticamente)
assets/img/…                     pastas dos PNGs (com .gitkeep)
scripts/gerar-manifesto.mjs      gera o manifesto (sem dependências)
vercel.json                      comando de build da Vercel
docs/ESPECIFICACOES-IMAGENS.md   tamanhos, nomes, enquadramento e checklist dos PNGs
```

## Como substituir as imagens

1. Produza o PNG com o nome exato indicado em `docs/ESPECIFICACOES-IMAGENS.md`.
2. Coloque o arquivo na pasta indicada, substituindo o existente, se houver.
3. Rode `node scripts/gerar-manifesto.mjs` (ou apenas publique, pois o build da Vercel faz isso).

Não é preciso mexer no código. Imagens ausentes não geram requisições nem erros no console.

## Executar localmente

É preciso um servidor local, porque o navegador não carrega as fontes a partir de arquivos abertos direto do disco.

```bash
cd apresentacao-vtd
node scripts/gerar-manifesto.mjs
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`. Sempre que adicionar ou trocar PNGs, rode o gerador de novo e atualize a página.

## Controles

| Ação | Como |
|---|---|
| Avançar / voltar de tela | Setas ↓ e ↑, PageDown e PageUp, Espaço, Enter, roda vertical do mouse, arrastar na vertical, botões ↑ ↓ da tela |
| Rolar galeria (Post Feed e Stories) | Setas ← e →, roda horizontal do mouse ou trackpad, arrastar na horizontal |
| Ir a uma tela específica | Pontos do menu lateral; Home (início) e End (orçamento) |
| Tela cheia | Tecla F ou botão ⛶ no canto inferior direito |

Vertical troca de tela. Horizontal rola a galeria. Uma transição por vez: enquanto uma anima, os comandos seguintes são ignorados.

## Publicar no Vercel

**Opção 1 — integração com Git (recomendada).** Importe o repositório no Vercel. O `vercel.json` já define o comando de build (`node scripts/gerar-manifesto.mjs`), que gera a lista de imagens a cada publicação. Não é preciso configurar mais nada, pois o site é estático e fica na raiz do projeto.

**Opção 2 — arrastar a pasta.** Como essa modalidade não roda o comando de build, rode `node scripts/gerar-manifesto.mjs` antes de enviar a pasta. Caso contrário, os PNGs novos não aparecem na versão publicada.

Os caminhos são relativos. O site funciona em qualquer domínio, inclusive em subpastas.

## Como a apresentação foi estruturada

- **Navegação e transições separadas.** `navegacao.js` controla o estado e o bloqueio. `transicoes.js` define apenas o visual de cada passagem, como uma função de progresso de 0 a 1. Avançar e voltar usam a mesma função.
- **Espaços vazios.** Sem PNG, o espaço continua reservado pelo CSS, sem placeholder gráfico, sem ícone e sem requisição.
- **Celular e tablet em retrato.** Layout vertical, parallax reduzido e transições mais curtas. Quem ativou a opção de reduzir movimento no sistema recebe transições curtas e sem parallax.

## Limitações conhecidas

- O manifesto depende do build ou do gerador. Se um PNG for colocado na pasta sem rodar o gerador, ele não aparece até que o manifesto seja atualizado.
- Na tela cheia, alguns navegadores móveis (como o Safari no iPhone) não permitem o modo tela cheia da página. Nesse caso o botão fica oculto.
- Os testes foram feitos no Chromium, em desktop e celular emulado. Safari e Firefox não foram testados.
