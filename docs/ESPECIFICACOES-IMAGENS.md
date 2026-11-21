# Especificações das imagens — VTD DESIGN

Todas as imagens são **PNG**, com os nomes e as pastas exatamente como listados abaixo.
Não é preciso alterar nenhum código: basta colocar o arquivo na pasta indicada, com o nome indicado,
e publicar de novo (ou rodar `node scripts/gerar-manifesto.mjs` antes de testar localmente).

**Enquadramento**
- `contain`: a imagem inteira cabe no espaço, sem cortes. As margens ficam transparentes ou com o fundo sólido da arte.
- `cover`: a imagem preenche todo o espaço e pode cortar as bordas. Exporte na proporção exata indicada.

**Fundo**
- Transparente: exporte com canal alfa. Use para logos e rascunhos, que aparecem sobre o fundo da tela.
- Sólido: inclua o fundo na própria arte (cor indicada). Use para fotos, mockups e as composições de tipografia e paleta.

---

## 1. Logos

| Arquivo | Pasta | Tamanho (px) | Proporção | Enquadramento | Fundo | Onde aparece |
|---|---|---|---|---|---|---|
| `logo-abertura.png` | `assets/img/logos/` | 1800 × 958 | 1,88 : 1 | contain | Transparente | Tela 1 — Abertura |
| `logo-vtd-design-branca.png` | `assets/img/logos/` | 2000 × 1200 | 5 : 3 | contain | Transparente | Tela 4 — Versão escolhida, e Tela 9 — Orçamento (mesmo arquivo nas duas) |

- Logo branca sobre fundo transparente.
- `logo-abertura.png` contém só “VTD”. `logo-vtd-design-branca.png` contém “VTD DESIGN”, com DESIGN abaixo.
- Deixe cerca de 10% de margem transparente em volta da logo, para que ela não encoste nas bordas do espaço.

## 2. Rascunhos apresentados

| Arquivo | Pasta | Tamanho (px) | Proporção | Enquadramento | Fundo | Onde aparece |
|---|---|---|---|---|---|---|
| `rascunho-01.png` | `assets/img/rascunhos/` | 1200 × 800 | 3 : 2 | contain | Transparente | Tela 3-1, à esquerda |
| `rascunho-02.png` | `assets/img/rascunhos/` | 1200 × 800 | 3 : 2 | contain | Transparente | Tela 3-1, no centro |
| `rascunho-03.png` | `assets/img/rascunhos/` | 1200 × 800 | 3 : 2 | contain | Transparente | Tela 3-1, à direita |

- Os rascunhos aparecem sobre fundo branco. Exporte com a cor final da logo (vermelho), sem fundo.

## 3. Feed e Stories

| Arquivo | Pasta | Tamanho (px) | Proporção | Enquadramento | Fundo | Onde aparece |
|---|---|---|---|---|---|---|
| `post-01.png` até `post-06.png` | `assets/img/feed/` | 1080 × 1350 | 4 : 5 | cover | Sólido | Tela 2 — Post Feed (galeria horizontal) |
| `story-01.png` até `story-06.png` | `assets/img/stories/` | 1080 × 1920 | 9 : 16 | cover | Sólido | Tela 3 — Stories (galeria horizontal) |

- Cada publicação é uma arte completa, com fundo e texto. Não há máscara nem recorte no código.
- Para mais ou menos publicações, altere `total` em `js/config.js` (seções `feed` e `stories`) e siga a numeração.

## 4. Tipografia (uma única imagem)

| Arquivo | Pasta | Tamanho (px) | Proporção | Enquadramento | Fundo | Onde aparece |
|---|---|---|---|---|---|---|
| `tipografia.png` | `assets/img/tipografia/` | 3240 × 1000 | 3,24 : 1 | contain | Sólido laranja `#FF5A00` | Tela 6 — Escolha tipográfica |

- A arte deve conter a composição inteira: o título “ESCOLHA TIPOGRÁFICA”, os dois cartões (Agressive e Nexa), as letras de cada fonte e o texto de apoio.
- Nenhum desses elementos é escrito em HTML, e o projeto não depende de fontes externas para essa tela.

## 5. Paleta (uma única imagem)

| Arquivo | Pasta | Tamanho (px) | Proporção | Enquadramento | Fundo | Onde aparece |
|---|---|---|---|---|---|---|
| `paleta.png` | `assets/img/paleta/` | 3240 × 1000 | 3,24 : 1 | contain | Sólido branco `#FFFFFF` | Tela 7 — Paleta de cores |

- A arte deve conter o título “PALETA DE CORES USADAS”, os círculos de cor, os valores CMYK e RGB e os códigos hexadecimais.
- Cores registradas na tela de paleta, para referência:

| Cor | Hexadecimal | CMYK | RGB |
|---|---|---|---|
| Vermelho | `#F21F0C` | C 0 · M 100 · Y 100 · K 0 | `#F21F0C` |
| Azul | `#3800FF` | C 85 · M 80 · Y 0 · K 0 | `#3800FF` |
| Branco | `#FFFFFF` | C 0 · M 0 · Y 0 · K 0 | `#FFFFFF` |
| Preto | `#000000` | — | — |

- A cor de fundo das telas da apresentação é o laranja `#FF5A00`. Ele não aparece na tela de paleta original; mantenha os valores da tela como estão na arte.

## 6. Mockups (quatro aplicações na mesma tela)

| Arquivo | Pasta | Tamanho (px) | Proporção | Enquadramento | Fundo | Posição na grade 2 × 2 |
|---|---|---|---|---|---|---|
| `mockup-01.png` | `assets/img/mockups/` | 1500 × 1000 | 3 : 2 | cover | Sólido | Superior esquerdo |
| `mockup-02.png` | `assets/img/mockups/` | 1500 × 1000 | 3 : 2 | cover | Sólido | Superior direito |
| `mockup-03.png` | `assets/img/mockups/` | 1500 × 1000 | 3 : 2 | cover | Sólido | Inferior esquerdo |
| `mockup-04.png` | `assets/img/mockups/` | 1500 × 1000 | 3 : 2 | cover | Sólido | Inferior direito |

- Cálculo da grade: as duas colunas têm a mesma largura, com espaço de 1,6 vw entre elas. No desktop, cada célula tem cerca de 25 vw × 16,7 vw. A grade inteira tem cerca de 35 vw de altura, o que cabe em telas 16:9 sem rolagem.
- No celular, a grade ocupa 90 vw de largura, com células de cerca de 44 vw.

---

## Arquivos a substituir (checklist)

Estes são os 23 PNGs que você deve produzir e colocar nas pastas indicadas. Enquanto um arquivo não existir, o espaço correspondente fica vazio e o restante da apresentação funciona normalmente.

- [ ] `assets/img/logos/logo-abertura.png`
- [ ] `assets/img/logos/logo-vtd-design-branca.png`
- [ ] `assets/img/rascunhos/rascunho-01.png`
- [ ] `assets/img/rascunhos/rascunho-02.png`
- [ ] `assets/img/rascunhos/rascunho-03.png`
- [ ] `assets/img/feed/post-01.png`
- [ ] `assets/img/feed/post-02.png`
- [ ] `assets/img/feed/post-03.png`
- [ ] `assets/img/feed/post-04.png`
- [ ] `assets/img/feed/post-05.png`
- [ ] `assets/img/feed/post-06.png`
- [ ] `assets/img/stories/story-01.png`
- [ ] `assets/img/stories/story-02.png`
- [ ] `assets/img/stories/story-03.png`
- [ ] `assets/img/stories/story-04.png`
- [ ] `assets/img/stories/story-05.png`
- [ ] `assets/img/stories/story-06.png`
- [ ] `assets/img/tipografia/tipografia.png`
- [ ] `assets/img/paleta/paleta.png`
- [ ] `assets/img/mockups/mockup-01.png`
- [ ] `assets/img/mockups/mockup-02.png`
- [ ] `assets/img/mockups/mockup-03.png`
- [ ] `assets/img/mockups/mockup-04.png`

---

## Peso dos arquivos

As transições dependem de as imagens estarem carregadas. Exporte cada PNG com compressão (por exemplo, pelo recurso de otimização do CorelDRAW ou com uma ferramenta como o TinyPNG). Arquivos de até cerca de 1 MB cada mantêm a apresentação fluida no celular.
