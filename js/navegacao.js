/* ==========================================================
   VTD DESIGN — Motor de navegação
   · Uma transição por vez (bloqueio enquanto anima)
   · Avançar e voltar usam a mesma transição (reversível)
   · Galerias (Feed e Stories) rolam dentro da própria tela
   · Entradas: clique, teclado, roda do mouse, toque e gestos
   ========================================================== */
(function () {
  'use strict';

  const CFG = window.VTD_CONFIG;
  const TR = window.VTD_TRANSICOES;
  const palco = document.getElementById('palco');
  const TELAS = Array.from(document.querySelectorAll('.tela'));
  const N = TELAS.length;
  const NOMES = ['Abertura', 'Post Feed', 'Stories', 'Rascunhos', 'Versão escolhida',
                 'Tipografia', 'Paleta', 'Representações', 'Orçamento'];
  const TEMAS = ['laranja', 'branca', 'laranja', 'branca', 'laranja',
                 'laranja', 'branca', 'branca', 'laranja'];

  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* celular e tablet em retrato usam o layout vertical (mesmo critério do CSS) */
  const celular = () => window.matchMedia('(max-width: 719px), (orientation: portrait) and (max-width: 1100px)').matches;
  const $ = (id) => document.getElementById(id);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  let atual = 0;
  let ocupado = false;
  let ultimoGesto = 0;

  /* ---------- Conteúdo a partir da configuração ---------- */
  /* manifesto gerado no build (assets/manifesto.json) lista os PNGs existentes;
     assim um espaço vazio não gera requisição nem erro 404 no console */
  let manifesto = null;

  function anexar(el, src, alt) {
    if (!el || !src) return;
    if (manifesto && !manifesto.has(src)) return;   /* espaço vazio: nada a carregar */
    const img = document.createElement('img');
    img.alt = alt || '';
    img.decoding = 'async';
    img.onerror = () => img.remove();      /* sem arquivo: o espaço fica vazio */
    img.src = src;
    el.appendChild(img);
  }

  function preencherTitulo(el, texto) {
    el.textContent = '';
    (texto || '').split(' ').forEach((p, i, arr) => {
      el.appendChild(document.createTextNode(p));
      if (i < arr.length - 1) el.appendChild(document.createElement('br'));
    });
  }

  function montarGaleria(trilho, cfg, alt, classe) {
    for (let i = 1; i <= cfg.total; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot slot-cover ' + classe;
      const num = String(i).padStart(2, '0');
      anexar(slot, `${cfg.pasta}/${cfg.prefixo}-${num}.png`, `${alt} ${i}`);
      trilho.appendChild(slot);
    }
  }

  function montarTelas() {
    const I = CFG.imagens;
    $('abertura-texto').textContent = CFG.abertura.texto;

    preencherTitulo($('feed-titulo'), CFG.feed.titulo);
    $('feed-descricao').textContent = CFG.feed.descricao;
    montarGaleria($('trilho-feed'), CFG.feed, 'Publicação', 'slot-feed');

    preencherTitulo($('stories-titulo'), CFG.stories.titulo);
    $('stories-descricao').textContent = CFG.stories.descricao;
    montarGaleria($('trilho-stories'), CFG.stories, 'Story', 'slot-story');

    $('rascunhos-titulo').textContent = CFG.rascunhos.titulo;
    $('versao-titulo').textContent = CFG.versao.titulo;
    $('versao-texto').textContent = CFG.versao.texto;
    $('representacoes-titulo').textContent = CFG.representacoes.titulo;
    $('representacoes-texto').textContent = CFG.representacoes.texto;

    document.querySelectorAll('[data-slot]').forEach((el) => {
      const i = Number(el.dataset.i || 0);
      const mapa = {
        abertura: I.abertura,
        versao: I.versao,
        final: I.final,
        tipografia: I.tipografia,
        paleta: I.paleta,
        rascunho: I.rascunhos[i],
        mockup: I.mockups[i]
      };
      anexar(el, mapa[el.dataset.slot], el.dataset.slot);
    });

    const cta = $('final-botao');
    cta.textContent = CFG.final.botao;
    cta.href = CFG.final.link;
  }

  function montarProgresso() {
    const nav = $('progresso');
    NOMES.forEach((nome, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.title = nome;
      b.setAttribute('aria-label', (i + 1) + '. ' + nome);
      b.addEventListener('click', () => irPara(i));
      nav.appendChild(b);
    });
  }

  /* ---------- Estado visual ---------- */
  function limparEstilos(el) {
    el.style.clipPath = '';
    el.style.opacity = '';
    el.style.background = '';
    el.querySelectorAll('[style]').forEach((n) => n.removeAttribute('style'));
  }

  function limparTudo() { TELAS.forEach(limparEstilos); }

  function render() {
    TELAS.forEach((t, i) => t.classList.toggle('ativa', i === atual));
    document.body.dataset.tema = TEMAS[atual];
    $('contador').textContent = String(atual + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0') +
      '  ·  ' + NOMES[atual];
    document.querySelectorAll('#progresso button').forEach((b, i) => {
      if (i === atual) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
  }

  /* ---------- Transições ---------- */
  function contexto(k) {
    return {
      a: TELAS[k],
      b: TELAS[k + 1],
      m: reduzido ? 0 : (celular() ? 0.45 : 1)   /* intensidade do parallax */
    };
  }

  function animar(k, alvo) {
    if (ocupado) return;
    ocupado = true;
    const c = contexto(k);
    if (TR[k].preparar) TR[k].preparar(c);
    c.a.classList.add('transicao');
    c.b.classList.add('transicao');

    const dur = reduzido ? 200 : (celular() ? 700 : 950);
    const inicio = alvo === 1 ? 0 : 1;
    const t0 = performance.now();

    const quadro = (agora) => {
      const f = Math.min(1, (agora - t0) / dur);
      TR[k].aplicar(ease(inicio + (alvo - inicio) * f), c);
      if (f < 1) requestAnimationFrame(quadro);
      else concluir(k, alvo, c);
    };
    requestAnimationFrame(quadro);
  }

  function concluir(k, alvo, c) {
    limparEstilos(c.a);
    limparEstilos(c.b);
    c.a.classList.remove('transicao');
    c.b.classList.remove('transicao');
    atual = alvo === 1 ? k + 1 : k;
    render();
    ocupado = false;
  }

  /* ---------- Galerias ---------- */
  const galeriaDa = (i) => (i === 1 || i === 2 ? TELAS[i].querySelector('.galeria') : null);

  /* Rolagem por passos de um item (sem scroll-snap, que travava o retorno no início).
     Retorna false quando a galeria já está na ponta, e então a tela muda. */
  function andarGaleria(g, d) {
    const max = g.scrollWidth - g.clientWidth;
    const x = g.scrollLeft;
    const pode = d > 0 ? x < max - 2 : x > 2;
    if (!pode) return false;
    const item = g.querySelector('.slot');
    const gap = parseFloat(getComputedStyle(g.firstElementChild).columnGap) || 0;
    const alvo = Math.max(0, Math.min(max, x + d * (item.offsetWidth + gap)));
    g.scrollTo({ left: alvo, behavior: reduzido ? 'auto' : 'smooth' });
    return true;
  }

  /* ---------- Comandos ---------- */
  /* Vertical (setas ↑↓, roda, arrastar na vertical) troca de tela.
     Horizontal (setas ←→, roda horizontal, arrastar na horizontal) rola a galeria. */
  function proximo() {
    if (ocupado) return;
    if (atual < N - 1) animar(atual, 1);
  }

  function anterior() {
    if (ocupado) return;
    if (atual > 0) animar(atual - 1, 0);
  }

  function galeriaPasso(d) {
    const g = galeriaDa(atual);
    if (g) andarGaleria(g, d);
  }

  function irPara(i) {
    if (ocupado || i === atual || i < 0 || i >= N) return;
    if (i === atual + 1) return animar(atual, 1);
    if (i === atual - 1) return animar(atual - 1, 0);
    /* saltos longos: troca com esmaecimento curto, sem encadear animações */
    ocupado = true;
    palco.style.opacity = '0';
    setTimeout(() => {
      atual = i;
      limparTudo();
      render();
      palco.style.opacity = '1';
      setTimeout(() => { ocupado = false; }, 280);
    }, reduzido ? 0 : 260);
  }

  function telaCheia() {
    if (!document.fullscreenElement) {
      const p = document.documentElement.requestFullscreen();
      if (p && p.catch) p.catch(() => {});
    } else {
      const p = document.exitFullscreen();
      if (p && p.catch) p.catch(() => {});
    }
  }

  /* ---------- Entradas ---------- */
  function ligarEntradas() {
    $('abertura').addEventListener('click', proximo);
    $('btn-proximo').addEventListener('click', proximo);
    $('btn-anterior').addEventListener('click', anterior);
    $('btn-tela-cheia').addEventListener('click', telaCheia);
    if (!document.documentElement.requestFullscreen) $('btn-tela-cheia').hidden = true;

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const emBotao = e.target.closest && e.target.closest('button, a');
      if ((e.key === ' ' || e.key === 'Enter') && emBotao) return;   /* o botão trata */
      switch (e.key) {
        case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
          e.preventDefault(); proximo(); break;
        case 'ArrowUp': case 'PageUp':
          e.preventDefault(); anterior(); break;
        case 'ArrowRight': e.preventDefault(); galeriaPasso(1); break;
        case 'ArrowLeft': e.preventDefault(); galeriaPasso(-1); break;
        case 'Home': e.preventDefault(); irPara(0); break;
        case 'End': e.preventDefault(); irPara(N - 1); break;
        case 'f': case 'F': telaCheia(); break;
      }
    });

    /* roda: vertical troca de tela; horizontal rola a galeria. Um gesto = um passo */
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (ocupado) return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const d = horizontal ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 15) return;
      if (horizontal) { galeriaPasso(d > 0 ? 1 : -1); return; }
      const agora = Date.now();
      if (agora - ultimoGesto < 700) return;
      ultimoGesto = agora;
      if (d > 0) proximo(); else anterior();
    }, { passive: false });

    /* toque: arrastar na vertical muda de tela; na horizontal rola a galeria (pan-x) */
    let toque = null;
    palco.addEventListener('pointerdown', (e) => { toque = { x: e.clientX, y: e.clientY }; });
    palco.addEventListener('pointerup', (e) => {
      if (!toque) return;
      const dx = e.clientX - toque.x;
      const dy = e.clientY - toque.y;
      toque = null;
      if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx) * 1.3) {
        if (dy < 0) proximo(); else anterior();
      }
    });
    palco.addEventListener('pointercancel', () => { toque = null; });
  }

  /* ---------- Início ---------- */
  function iniciar() {
    /* sem fetch ou sem manifesto, todos os espaços são tentados (degradação segura) */
    const pedido = typeof fetch === 'function'
      ? fetch('assets/manifesto.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null))
      : Promise.resolve(null);
    pedido
      .catch(() => null)
      .then((dados) => {
        if (dados && Array.isArray(dados.imagens)) manifesto = new Set(dados.imagens);
        montarTelas();
        montarProgresso();
        ligarEntradas();
        limparTudo();
        render();
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
