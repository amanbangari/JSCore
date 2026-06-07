/* ============================================================
   JS MASTERY — PREMIUM EDUCATIONAL LANDING PAGE
   main.js | All Interactive Logic
   ============================================================ */

'use strict';

/* ── DOM Ready ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeroSequence();
  initNavbar();
  initScrollReveal();
  initScrollProgress();
  initMemoryGrid();
  initVariableTabs();
  initCopyButtons();
  initDemoButton();
  initCheckoutDemo();
  initCoercionTester();
  initEqualityExamples();
  initActiveNavLinks();
  initMobileMenu();
});

/* ══════════════════════════════════════════════════════════
   NAVBAR — scroll behaviour
══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const threshold = 60;

  window.addEventListener('scroll', () => {
    if (window.scrollY > threshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ── Scroll Progress Bar ──────────────────────────────────── */
function initScrollProgress() {
  const bar = document.querySelector('.navbar__progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min((scrollTop / docHeight) * 100, 100);
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ── Active nav links ─────────────────────────────────────── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.navbar__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ── Mobile Menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -64px 0px',
    threshold: 0.08,
  });

  revealEls.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   MEMORY GRID — Section 4
══════════════════════════════════════════════════════════ */
function initMemoryGrid() {
  const grid = document.getElementById('memoryGrid');
  if (!grid) return;

  const cells = [];
  const TOTAL = 64;

  // Name occupies indices 8..15 (8 bytes for a string ref)
  const nameBytes = [8, 9, 10, 11, 12, 13, 14, 15];
  // Age occupies indices 24..27 (4 bytes for a number)
  const ageBytes  = [24, 25, 26, 27];

  const nameBits = ['4A', '6F', '68', '6E', '00', '00', '00', '00'];
  const ageBits  = ['1A', '00', '00', '00', '--', '--', '--', '--'];

  for (let i = 0; i < TOTAL; i++) {
    const cell = document.createElement('div');
    cell.classList.add('memory-cell');

    if (nameBytes.includes(i)) {
      cell.classList.add('highlight-name');
      cell.textContent = nameBits[nameBytes.indexOf(i)];
    } else if (ageBytes.includes(i)) {
      cell.classList.add('highlight-age');
      cell.textContent = ageBits[ageBytes.indexOf(i)];
    } else {
      // random background memory noise
      const val = Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
      cell.textContent = val;
    }

    cells.push(cell);
    grid.appendChild(cell);
  }

  // Animate name bytes with a stagger
  let tick = 0;
  setInterval(() => {
    cells.forEach(c => c.classList.remove('highlight-active'));
    const allHighlighted = [...nameBytes, ...ageBytes];
    const target = allHighlighted[tick % allHighlighted.length];
    if (cells[target]) cells[target].classList.add('highlight-active');
    tick++;
  }, 700);
}

/* ══════════════════════════════════════════════════════════
   VARIABLE TABS — Section 5
══════════════════════════════════════════════════════════ */
function initVariableTabs() {
  const tabs   = document.querySelectorAll('.var-tab');
  const panels = document.querySelectorAll('.var-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.className = 'var-tab';
      });

      tab.classList.add(`active--${target}`);

      panels.forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(`panel-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ══════════════════════════════════════════════════════════
   COPY BUTTONS
══════════════════════════════════════════════════════════ */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const block = btn.closest('.code-block');
      const code  = block ? block.querySelector('code') : null;
      if (!code) return;

      const text = code.innerText;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity  = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      const original = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '<i class="fa fa-check"></i> Copied!';
      showToast('Code copied to clipboard!');

      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = original;
      }, 2000);
    });
  });
}

/* ── Toast ──────────────────────────────────────────────── */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa fa-check toast__icon"></i><span id="toastMsg"></span>`;
    document.body.appendChild(toast);
  }
  document.getElementById('toastMsg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ══════════════════════════════════════════════════════════
   DEMO BUTTON — Section 3
══════════════════════════════════════════════════════════ */
function initDemoButton() {
  const btn = document.getElementById('dynBtn');
  if (!btn) return;

  let liked = false;
  btn.addEventListener('click', () => {
    liked = !liked;
    if (liked) {
      btn.classList.add('liked');
      btn.textContent = '✓ Liked!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else {
      btn.classList.remove('liked');
      btn.textContent = '♥ Like this post';
      btn.style.background = '';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   CHECKOUT DEMO — Section 8
══════════════════════════════════════════════════════════ */
function initCheckoutDemo() {
  const priceInput    = document.getElementById('itemPrice');
  const discountInput = document.getElementById('discountPct');
  const resultEl      = document.getElementById('checkoutResult');

  if (!priceInput || !discountInput || !resultEl) return;

  function updateCheckout() {
    const price    = parseFloat(priceInput.value)    || 0;
    const discount = parseFloat(discountInput.value) || 0;

    const discountAmount = price * (discount / 100);
    const finalPrice     = price - discountAmount;
    const taxAmount      = finalPrice * 0.08;
    const total          = finalPrice + taxAmount;

    resultEl.innerHTML = `
      <span style="color: var(--text-muted)">// JavaScript at checkout</span>
      <br>
      <span class="tok-keyword">const</span> <span class="tok-var">price</span>    <span class="tok-op">=</span> <span class="tok-number">${price.toFixed(2)}</span>;
      <br>
      <span class="tok-keyword">const</span> <span class="tok-var">discount</span> <span class="tok-op">=</span> price <span class="tok-op">*</span> <span class="tok-number">${(discount/100).toFixed(2)}</span>; <span class="tok-comment">// $${discountAmount.toFixed(2)}</span>
      <br>
      <span class="tok-keyword">const</span> <span class="tok-var">tax</span>      <span class="tok-op">=</span> (price <span class="tok-op">-</span> discount) <span class="tok-op">*</span> <span class="tok-number">0.08</span>; <span class="tok-comment">// $${taxAmount.toFixed(2)}</span>
      <br>
      <span class="tok-keyword">const</span> <span class="tok-var">total</span>    <span class="tok-op">=</span> price <span class="tok-op">-</span> discount <span class="tok-op">+</span> tax;  <span class="tok-comment">// <strong style="color:var(--color-green)">$${total.toFixed(2)}</strong></span>
    `;
  }

  priceInput.addEventListener('input',    updateCheckout);
  discountInput.addEventListener('input', updateCheckout);
  updateCheckout();
}

/* ══════════════════════════════════════════════════════════
   COERCION TESTER — Section 9
══════════════════════════════════════════════════════════ */
function initCoercionTester() {
  const aInput   = document.getElementById('coerceA');
  const bInput   = document.getElementById('coerceB');
  const opSelect = document.getElementById('coerceOp');
  const resultEl = document.getElementById('coercionResult');

  if (!aInput || !bInput || !opSelect || !resultEl) return;

  function updateCoercion() {
    const aRaw = aInput.value;
    const bRaw = bInput.value;
    const op   = opSelect.value;

    // Detect types
    const aType = detectType(aRaw);
    const bType = detectType(bRaw);

    // Evaluate as JS
    let result, warning = '';

    try {
      /* eslint-disable no-new-func */
      result = new Function(`return (${JSON.stringify(aRaw)} ${op} ${JSON.stringify(bRaw)})`)();
    } catch {
      result = 'Error';
    }

    const resultType = typeof result;

    if (aType !== bType && op === '+') {
      warning = `⚠️ Type mismatch! "${aRaw}" is a ${aType}, "${bRaw}" is a ${bType}. JS concatenated instead of adding.`;
    }

    const typeColorA = typeColor(aType);
    const typeColorB = typeColor(bType);
    const typeColorR = typeColor(resultType);

    resultEl.innerHTML = `
      <div style="margin-bottom:10px">
        <span style="color:var(--text-muted);font-size:0.75rem">INPUT TYPES</span><br>
        <span style="color:${typeColorA}">"${aRaw}"</span>
        <span style="color:var(--text-muted);font-size:0.8rem"> → ${aType}</span>
        &nbsp; ${op} &nbsp;
        <span style="color:${typeColorB}">"${bRaw}"</span>
        <span style="color:var(--text-muted);font-size:0.8rem"> → ${bType}</span>
      </div>
      <div style="margin-bottom:8px">
        <span style="color:var(--text-muted);font-size:0.75rem">RESULT</span><br>
        <span style="color:${typeColorR};font-size:1.1rem;font-weight:700">${JSON.stringify(result)}</span>
        <span style="color:var(--text-muted);font-size:0.8rem"> (${resultType})</span>
      </div>
      ${warning ? `<div style="color:var(--color-gold);font-size:0.8rem;margin-top:6px;padding:8px;background:rgba(245,158,11,0.08);border-radius:6px;border:1px solid rgba(245,158,11,0.2)">${warning}</div>` : ''}
    `;
  }

  function detectType(val) {
    if (!isNaN(Number(val)) && val.trim() !== '') return 'number';
    if (val === 'true' || val === 'false')         return 'boolean';
    if (val === 'null')                             return 'null';
    if (val === 'undefined')                        return 'undefined';
    return 'string';
  }

  function typeColor(type) {
    const map = {
      string: 'var(--syn-string)',
      number: 'var(--syn-number)',
      boolean: 'var(--syn-boolean)',
      null: 'var(--text-muted)',
      undefined: 'var(--syn-operator)',
      object: 'var(--syn-class)',
    };
    return map[type] || 'var(--text-primary)';
  }

  aInput.addEventListener('input',    updateCoercion);
  bInput.addEventListener('input',    updateCoercion);
  opSelect.addEventListener('change', updateCoercion);
  updateCoercion();
}

/* ══════════════════════════════════════════════════════════
   EQUALITY EXAMPLES — Section 10
══════════════════════════════════════════════════════════ */
function initEqualityExamples() {
  const items = document.querySelectorAll('.eq-item');

  items.forEach(item => {
    const left   = item.dataset.left;
    const right  = item.dataset.right;
    const loose  = item.querySelector('.eq-loose');
    const strict = item.querySelector('.eq-strict');

    if (!loose || !strict) return;

    try {
      /* eslint-disable no-new-func */
      const looseResult  = new Function(`return (${left} == ${right})`)();
      const strictResult = new Function(`return (${left} === ${right})`)();

      loose.textContent  = String(looseResult);
      strict.textContent = String(strictResult);

      loose.style.color  = looseResult  ? 'var(--color-green)' : 'var(--color-red)';
      strict.style.color = strictResult ? 'var(--color-green)' : 'var(--color-red)';
    } catch {
      loose.textContent  = 'error';
      strict.textContent = 'error';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   HERO IMAGE SEQUENCE — Canvas frame player
   80 frames at ~24fps = seamless looping animation
══════════════════════════════════════════════════════════ */
function initHeroSequence() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx   = canvas.getContext('2d');
  const hero  = document.getElementById('hero');

  /* ── Configuration ── */
  const FRAME_COUNT  = 80;
  const FPS          = 24;          // target frames per second
  const MS_PER_FRAME = 1000 / FPS;  // ~41.67ms
  const BASE_PATH    = 'hero/JavaScript_code_transforms_synta\u2026_202606071025_';

  /* ── Respect prefers-reduced-motion ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Resize canvas to fill hero ── */
  function resizeCanvas() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    // Repaint current frame immediately after resize
    if (frames[currentFrame] && frames[currentFrame].complete) {
      drawFrame(currentFrame);
    }
  }

  /* ── Draw a single frame, cover-fitting the canvas ── */
  function drawFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cW = canvas.width;
    const cH = canvas.height;
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    // Cover: scale so the image fills the canvas, cropping edges
    const scale  = Math.max(cW / iW, cH / iH);
    const dW     = iW * scale;
    const dH     = iH * scale;
    const dX     = (cW - dW) / 2;
    const dY     = (cH - dH) / 2;

    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, dX, dY, dW, dH);
  }

  /* ── Frame storage ── */
  const frames     = new Array(FRAME_COUNT);
  let loadedCount  = 0;
  let currentFrame = 0;
  let lastTs       = 0;
  let rafId        = null;
  let started      = false;

  /* ── Loading indicator (small pill in hero) ── */
  const loader = document.createElement('div');
  loader.id    = 'heroLoader';
  loader.setAttribute('aria-hidden', 'true');
  loader.style.cssText = [
    'position:absolute',
    'bottom:72px',
    'left:50%',
    'transform:translateX(-50%)',
    'z-index:3',
    'display:flex',
    'align-items:center',
    'gap:8px',
    'font-family:var(--font-mono)',
    'font-size:0.7rem',
    'color:rgba(255,255,255,0.45)',
    'background:rgba(0,0,0,0.4)',
    'border:1px solid rgba(255,255,255,0.08)',
    'border-radius:99px',
    'padding:5px 14px',
    'backdrop-filter:blur(8px)',
    'transition:opacity 0.4s ease',
  ].join(';');
  hero.appendChild(loader);

  function updateLoader() {
    const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
    loader.textContent = `Loading animation… ${pct}%`;
  }
  updateLoader();

  /* ── RAF loop ── */
  function tick(ts) {
    rafId = requestAnimationFrame(tick);

    const elapsed = ts - lastTs;
    if (elapsed < MS_PER_FRAME) return; // haven't hit next frame time yet

    lastTs = ts - (elapsed % MS_PER_FRAME); // keep drift-free
    currentFrame = (currentFrame + 1) % FRAME_COUNT;
    drawFrame(currentFrame);
  }

  /* ── Start playback once first frame ready ── */
  function maybeStart() {
    if (started) return;
    if (!frames[0] || !frames[0].complete) return;

    started = true;
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    drawFrame(0);
    canvas.classList.add('ready'); // fade in

    if (!prefersReduced) {
      lastTs = performance.now();
      rafId  = requestAnimationFrame(tick);
    }
  }

  /* ── Preload all frames ── */
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img  = new Image();
    const idx  = i; // close over
    const num  = String(i).padStart(3, '0');
    img.src    = `${BASE_PATH}${num}.jpg`;
    frames[idx] = img;

    img.onload = () => {
      loadedCount++;
      updateLoader();

      if (idx === 0) maybeStart(); // kick off as soon as frame 0 is ready

      // Hide loader once all frames are loaded
      if (loadedCount === FRAME_COUNT) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 450);
      }
    };

    img.onerror = () => {
      loadedCount++; // don't block on missing frames
      updateLoader();
    };
  }

  /* ── Resize handler — debounced ── */
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 120);
  }, { passive: true });

  /* ── Pause when tab hidden, resume when visible ── */
  document.addEventListener('visibilitychange', () => {
    if (!started || prefersReduced) return;
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      lastTs = performance.now();
      rafId  = requestAnimationFrame(tick);
    }
  });
}

/* ══════════════════════════════════════════════════════════
   SMOOTH SCROLL (for anchor links)
══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
