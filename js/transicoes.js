/* ==========================================================
   VTD DESIGN — Transições entre as telas
   Cada item é o link entre tela k e tela k+1 (8 links).
   aplicar(e, c): e vai de 0 (tela de origem) a 1 (tela de destino).
   Como o motor interpola e pode inverter, cada transição é
   reversível: ao voltar, o mesmo código roda de 1 a 0.
   preparar(c) (opcional) mede a geometria antes do movimento.
   ========================================================== */
(function () {
  'use strict';

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const q = (el, sel) => (el ? el.querySelector(sel) : null);
  const f3 = (v) => v.toFixed(3);
  let offs = [];

  window.VTD_TRANSICOES = [

    /* 0 · Abertura → Post Feed: a logo cresce e a janela do feed se abre no seu centro */
    {
      aplicar(e, c) {
        const r = lerp(42, 0, e);
        c.b.style.clipPath = `inset(${r}% ${r}% ${r}% ${r}% round ${lerp(60, 0, e).toFixed(1)}px)`;
        const logo = q(c.a, '.slot-logo-abertura');
        if (logo) {
          logo.style.transform = `scale(${lerp(1, 5, e).toFixed(4)})`;
          logo.style.opacity = f3(clamp(1 - e * 1.6));
        }
        const linhas = q(c.a, '.fundo-linhas');
        if (linhas) linhas.style.transform = `translate(${(e * 60 * c.m).toFixed(1)}px, ${(e * -40 * c.m).toFixed(1)}px)`;
        const cont = q(c.b, '.conteudo');
        if (cont) cont.style.transform = `scale(${lerp(1.2, 1, e).toFixed(4)})`;
      }
    },

    /* 1 · Post Feed → Stories: o laranja entra varrendo da direita; o feed recua em parallax */
    {
      aplicar(e, c) {
        c.b.style.clipPath = `inset(0 0 0 ${lerp(100, 0, e).toFixed(3)}%)`;
        const blocoA = q(c.a, '.bloco-galeria');
        if (blocoA) blocoA.style.transform = `translateX(${(-e * 35 * c.m).toFixed(2)}%)`;
        const cabA = q(c.a, '.cabecalho');
        if (cabA) cabA.style.opacity = f3(clamp(1 - e * 1.5));
        const blocoB = q(c.b, '.bloco-galeria');
        if (blocoB) blocoB.style.transform = `translateX(${(lerp(25, 0, e) * c.m).toFixed(2)}%)`;
      }
    },

    /* 2 · Stories → Rascunhos: um story se aproxima da câmera e a tela clareia */
    {
      aplicar(e, c) {
        const blocoA = q(c.a, '.bloco-galeria');
        if (blocoA) blocoA.style.transform = `scale(${lerp(1, 1.8, e).toFixed(4)})`;
        const cabA = q(c.a, '.cabecalho');
        if (cabA) cabA.style.opacity = f3(clamp(1 - e * 2));
        c.b.style.opacity = f3(clamp(e * 1.3));
        c.b.style.transform = `scale(${lerp(0.92, 1, e).toFixed(4)})`;
      }
    },

    /* 3 · Rascunhos → Versão escolhida: os rascunhos se afastam e a logo escolhida cresce */
    {
      aplicar(e, c) {
        c.a.querySelectorAll('.slot-rascunho').forEach((s, i) => {
          const k = clamp((e - i * 0.1) / 0.9);
          s.style.transform = `scale(${lerp(1, 0.4, k).toFixed(4)})`;
          s.style.opacity = f3(clamp(1 - k * 1.2));
        });
        c.b.style.opacity = f3(clamp(e * 1.4));
        const logo = q(c.b, '.slot-versao');
        if (logo) logo.style.transform = `scale(${lerp(0.35, 1, e).toFixed(4)})`;
      }
    },

    /* 4 · Versão escolhida → Tipografia: revelação por círculo a partir do centro */
    {
      aplicar(e, c) {
        const cont = q(c.a, '.conteudo');
        if (cont) {
          cont.style.transform = `translateY(${(-e * 20).toFixed(2)}%)`;
          cont.style.opacity = f3(clamp(1 - e * 1.3));
        }
        c.b.style.clipPath = `circle(${lerp(0, 80, e).toFixed(2)}% at 50% 50%)`;
        const faixa = q(c.b, '.slot-faixa');
        if (faixa) faixa.style.transform = `scale(${lerp(1.15, 1, e).toFixed(4)})`;
      }
    },

    /* 5 · Tipografia → Paleta: a composição recua e a nova tela sobe por máscara */
    {
      aplicar(e, c) {
        const faixa = q(c.a, '.slot-faixa');
        if (faixa) {
          faixa.style.transform = `scale(${lerp(1, 0.5, e).toFixed(4)})`;
          faixa.style.opacity = f3(clamp(1 - e * 1.2));
        }
        c.b.style.clipPath = `inset(${lerp(100, 0, e).toFixed(2)}% 0 0 0)`;
      }
    },

    /* 6 · Paleta → Representações: a composição encolhe e os quatro mockups se abrem em grade */
    {
      preparar(c) {
        const o = q(c.a, '.slot-faixa').getBoundingClientRect();
        const ox = o.left + o.width / 2;
        const oy = o.top + o.height / 2;
        offs = Array.from(c.b.querySelectorAll('.slot-mock')).map((s) => {
          const r = s.getBoundingClientRect();
          return { dx: ox - (r.left + r.width / 2), dy: oy - (r.top + r.height / 2) };
        });
      },
      aplicar(e, c) {
        const faixa = q(c.a, '.slot-faixa');
        if (faixa) {
          faixa.style.transform = `scale(${lerp(1, 0.25, e).toFixed(4)})`;
          faixa.style.opacity = f3(clamp(1 - e * 1.4));
        }
        c.b.style.background = 'transparent';
        const linhas = q(c.b, '.fundo-linhas');
        if (linhas) linhas.style.opacity = f3(e);
        const cab = q(c.b, '.cabecalho');
        if (cab) cab.style.opacity = f3(clamp(e * 1.6));
        c.b.querySelectorAll('.slot-mock').forEach((s, i) => {
          const o = offs[i] || { dx: 0, dy: 0 };
          s.style.transform = `translate(${(o.dx * (1 - e)).toFixed(1)}px, ${(o.dy * (1 - e)).toFixed(1)}px) scale(${lerp(0.2, 1, e).toFixed(4)})`;
          s.style.opacity = f3(clamp(e * 2 - i * 0.1));
        });
      }
    },

    /* 7 · Representações → Orçamento: zoom out até a logo; o botão nasce da pílula */
    {
      aplicar(e, c) {
        const cont = q(c.a, '.conteudo');
        if (cont) {
          cont.style.transform = `scale(${lerp(1, 0.6, e).toFixed(4)})`;
          cont.style.opacity = f3(clamp(1 - e * 1.1));
        }
        c.b.style.opacity = f3(clamp(e * 1.2));
        const logo = q(c.b, '.slot-versao');
        if (logo) logo.style.transform = `scale(${lerp(1.6, 1, e).toFixed(4)})`;
        const cta = q(c.b, '.cta');
        if (cta) {
          const k = clamp((e - 0.45) / 0.55);
          cta.style.opacity = f3(k);
          cta.style.transform = `scale(${lerp(0.2, 1, k).toFixed(4)})`;
        }
      }
    }
  ];
})();
