/* ============================================================
   LOPPIANO × VIGNOLI — app.js
   Paleta Food · 2026
   ============================================================ */

(() => {
  'use strict';

  /* ── CUSTOM CURSOR (desktop only) ── */
  function initCursor() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const dot  = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .melhoria-item, .ig-card, .paleta-pillar, .base-pillar').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.width = ring.style.width = '48px';
        dot.style.height = ring.style.height = '48px';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.width = dot.style.height = '8px';
        ring.style.width = ring.style.height = '36px';
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
    items.forEach(el => obs.observe(el));
  }

  /* ── SCORE BARS ── */
  function initScoreBars() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const fill = e.target.querySelector('.score-fill');
        if (fill) {
          const target = fill.dataset.score || '0';
          fill.style.width = '0';
          setTimeout(() => { fill.style.width = target + '%'; }, 200);
        }
        obs.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.score-track').forEach(el => obs.observe(el));
  }

  /* ── COUNTER ANIMATION ── */
  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();
        (function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(target * ease) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    els.forEach(el => obs.observe(el));
  }

  /* ── TIMELINE STAGGER ── */
  function initTimeline() {
    const items = document.querySelectorAll('.tl-item');
    if (!items.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const idx = parseInt(e.target.dataset.idx || 0);
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateX(0)';
        }, idx * 110);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-16px)';
      el.style.transition = 'opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)';
      el.dataset.idx = i;
      obs.observe(el);
    });
  }

  /* ── NAV ACTIVE STATE ON SCROLL ── */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.style.borderBottomColor = window.scrollY > 60
        ? 'rgba(184,145,58,0.2)'
        : 'rgba(255,255,255,0.07)';
    }, { passive: true });
  }

  /* ── SMOOTH ANCHOR SCROLL ── */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
      });
    });
  }

  /* ── BLUR INTERACTION: click to peek ── */
  function initBlurPeek() {
    document.querySelectorAll('.tl-item.dead').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.querySelector('.tl-name');
        const year = item.querySelector('.tl-year');
        if (!name) return;
        const isHidden = name.style.filter !== 'blur(0px)';
        name.style.filter = isHidden ? 'blur(0px)' : '';
        name.style.color  = isHidden ? 'rgba(242,234,216,0.5)' : '';
        if (year) year.style.filter = isHidden ? 'blur(0px)' : '';
        name.style.transition = 'filter .4s ease';
      });
      item.setAttribute('title', 'Toque para revelar');
      item.style.cursor = 'pointer';
    });
  }

  /* ── INIT ── */
  function init() {
    initCursor();
    initReveal();
    initScoreBars();
    initCounters();
    initTimeline();
    initNav();
    initAnchors();
    initBlurPeek();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
