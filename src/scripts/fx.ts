/* Efectos interactivos, cargados bajo demanda desde site.ts.
   Todo es mejora progresiva: sin este módulo el contenido se ve y funciona igual (estático).
   Con prefers-reduced-motion no hay giros, inclinaciones ni animaciones; los diagramas se resaltan sin transición. */
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s as any)) as T[];

let started = false;

export function init() {
  if (started) return;
  started = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.documentElement.classList.add('fx');
  if (!reduced) scenes(finePointer);
  if (!reduced && finePointer) tilt();
  diagrams(reduced);
  lightbox();
}

/* ---------- Escena 3D: gira con el puntero (o deriva suave sin puntero fino) y se pausa fuera de pantalla ---------- */
function scenes(finePointer: boolean) {
  $$('[data-scene]').forEach((scene) => {
    const rig = scene.querySelector<HTMLElement>('.rig');
    if (!rig) return;
    /* En pantallas estrechas la escena es 2D (CSS): no se anima. */
    const flat = matchMedia('(max-width: 767px)');
    let tx = 0, ty = 0, x = 0, y = 0, visible = false, raf = 0, t0 = performance.now(), hover = false;
    const frame = (now: number) => {
      if (!visible || flat.matches) { raf = 0; return; }
      if (!hover) {
        const k = (now - t0) / 1000;
        tx = Math.sin(k * 0.5) * 6;
        ty = Math.cos(k * 0.4) * 4;
      }
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      rig.style.setProperty('--ry', `${x.toFixed(2)}deg`);
      rig.style.setProperty('--rx', `${y.toFixed(2)}deg`);
      raf = requestAnimationFrame(frame);
    };
    new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible && !raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
    }).observe(scene);
    flat.addEventListener('change', () => { if (!flat.matches && visible && !raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); } });
    scene.classList.add('live');
    if (!finePointer) return;
    scene.addEventListener('pointermove', (e) => {
      const r = scene.getBoundingClientRect();
      hover = true;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 34;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 22;
    });
    scene.addEventListener('pointerleave', () => { hover = false; t0 = performance.now(); });
  });
}

/* ---------- Tarjetas con inclinación (tilt) según la posición del puntero ---------- */
function tilt() {
  $$('[data-tilt]').forEach((el) => {
    let raf = 0;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--tx', `${(py * -5).toFixed(2)}deg`);
        el.style.setProperty('--ty', `${(px * 6).toFixed(2)}deg`);
        el.classList.add('tilting');
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      el.classList.remove('tilting');
      el.style.removeProperty('--tx');
      el.style.removeProperty('--ty');
    });
  });
}

/* ---------- Diagramas: resaltar el recorrido hasta un paso y botón «Recorrer» ---------- */
function diagrams(reduced: boolean) {
  $$('[data-flow]').forEach((fig) => {
    const steps = $$<HTMLLIElement>('.fn', fig);
    const play = fig.querySelector<HTMLButtonElement>('[data-flow-play]');
    const live = fig.querySelector<HTMLElement>('[data-flow-live]');
    if (!steps.length) return;
    let timer = 0;
    const light = (upto: number) => {
      fig.classList.toggle('lit', upto >= 0);
      steps.forEach((s, i) => {
        s.classList.toggle('on', i <= upto);
        s.classList.toggle('cur', i === upto);
      });
    };
    const label = (i: number) => steps[i].querySelector('b')?.textContent ?? '';
    steps.forEach((s, i) => {
      s.addEventListener('pointerenter', () => { if (!timer) light(i); });
    });
    fig.querySelector('.flow-list')?.addEventListener('pointerleave', () => { if (!timer) light(-1); });
    if (!play || !live) return;
    play.hidden = false;
    play.addEventListener('click', () => {
      clearInterval(timer);
      const n = steps.length;
      const say = (i: number) => { live.textContent = `${play.dataset.step} ${i + 1} ${play.dataset.of} ${n}: ${label(i)}`; };
      if (reduced) { light(n - 1); live.textContent = steps.map((_, i) => label(i)).join(' → '); return; }
      let i = 0;
      light(0); say(0);
      play.setAttribute('aria-pressed', 'true');
      timer = window.setInterval(() => {
        i += 1;
        if (i >= n) {
          clearInterval(timer); timer = 0;
          play.setAttribute('aria-pressed', 'false');
          setTimeout(() => light(-1), 1400);
          return;
        }
        light(i); say(i);
      }, 650);
    });
  });
}

/* ---------- Visor de capturas: <dialog> nativo (Esc cierra, foco atrapado y devuelto), flechas para navegar ---------- */
function lightbox() {
  const links = $$<HTMLAnchorElement>('a[data-lb]');
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const b = document.body.dataset;
  const dlg = document.createElement('dialog');
  dlg.className = 'lb';
  dlg.innerHTML = `
    <figure class="lb-fig"><img class="lb-img" alt="" /><figcaption class="lb-cap"></figcaption></figure>
    <div class="lb-bar">
      <button type="button" class="lb-btn lb-prev"><span aria-hidden="true">←</span><span class="sr-only"></span></button>
      <span class="lb-count mono" aria-live="polite"></span>
      <button type="button" class="lb-btn lb-next"><span aria-hidden="true">→</span><span class="sr-only"></span></button>
      <button type="button" class="lb-btn lb-close"><span aria-hidden="true">✕</span><span class="sr-only"></span></button>
    </div>`;
  document.body.appendChild(dlg);
  const img = dlg.querySelector<HTMLImageElement>('.lb-img')!;
  const cap = dlg.querySelector<HTMLElement>('.lb-cap')!;
  const count = dlg.querySelector<HTMLElement>('.lb-count')!;
  const prev = dlg.querySelector<HTMLButtonElement>('.lb-prev')!;
  const next = dlg.querySelector<HTMLButtonElement>('.lb-next')!;
  const close = dlg.querySelector<HTMLButtonElement>('.lb-close')!;
  prev.querySelector('.sr-only')!.textContent = b.lbPrev ?? 'Previous';
  next.querySelector('.sr-only')!.textContent = b.lbNext ?? 'Next';
  close.querySelector('.sr-only')!.textContent = b.lbClose ?? 'Close';
  dlg.setAttribute('aria-label', cap.textContent || 'Visor');
  let group: HTMLAnchorElement[] = [];
  let idx = 0;
  let opener: HTMLElement | null = null;
  const show = (i: number) => {
    idx = (i + group.length) % group.length;
    const a = group[idx];
    const alt = a.querySelector('img')?.getAttribute('alt') ?? '';
    img.src = a.href;
    img.alt = alt;
    cap.textContent = a.dataset.cap || alt;
    dlg.setAttribute('aria-label', a.dataset.cap || alt);
    count.textContent = group.length > 1 ? `${idx + 1} / ${group.length}` : '';
    prev.hidden = next.hidden = group.length < 2;
  };
  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      opener = a;
      group = a.dataset.lb ? links.filter((l) => l.dataset.lb === a.dataset.lb) : [a];
      show(group.indexOf(a));
      dlg.showModal();
      close.focus();
    });
  });
  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));
  close.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && group.length > 1) show(idx - 1);
    if (e.key === 'ArrowRight' && group.length > 1) show(idx + 1);
  });
  dlg.addEventListener('close', () => { img.removeAttribute('src'); opener?.focus(); });
}
