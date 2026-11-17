/* Comportamiento compartido: barra de progreso, revelado, nav activa, proceso, copiar email, cursor. */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s as any) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s as any)) as T[];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Barra de progreso de lectura */
const bar = $('#progress');
let tick = false;
function onScroll() {
  if (tick || !bar) return;
  tick = true;
  requestAnimationFrame(() => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    tick = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

if ('IntersectionObserver' in window) {
  const ro = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }),
    { rootMargin: '0px 0px -8% 0px' },
  );
  $$('.reveal').forEach((e) => ro.observe(e));

  const links = $$<HTMLAnchorElement>('.nav li a[data-sec]');
  const so = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', String(a.dataset.sec === e.target.id)));
    }),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  $$('main section[id]').forEach((s) => so.observe(s));

  const pn = $('#proc-n'), pl = $('#proc-l'), box = $('.proc-stick');
  const steps = $$('.step');
  if (pn && pl && box && steps.length) {
    const po = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        steps.forEach((s) => s.classList.toggle('active', s === e.target));
        const d = (e.target as HTMLElement).dataset;
        pn.textContent = d.n ?? '';
        pl.textContent = d.l ?? '';
        box.style.background = d.c ?? '';
        box.style.color = d.f ?? '';
        if (!reduced) {
          pn.style.transform = 'scale(.8) rotate(-6deg)';
          requestAnimationFrame(() => requestAnimationFrame(() => { pn.style.transform = ''; }));
        }
      }),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    steps.forEach((s) => po.observe(s));
    steps[0].classList.add('active');
  }
} else {
  $$('.reveal').forEach((e) => e.classList.add('in'));
}

/* Alternar tema claro/oscuro (persistido con try/catch) */
const toggle = $<HTMLButtonElement>('#theme-toggle');
const darkMq = matchMedia('(prefers-color-scheme: dark)');
const effective = () => document.documentElement.getAttribute('data-theme') || (darkMq.matches ? 'dark' : 'light');
function syncToggle() {
  if (!toggle) return;
  const isDark = effective() === 'dark';
  toggle.setAttribute('aria-label', (isDark ? toggle.dataset.labelLight : toggle.dataset.labelDark) ?? '');
  toggle.dataset.mode = isDark ? 'dark' : 'light';
}
if (toggle) {
  toggle.hidden = false;
  syncToggle();
  toggle.addEventListener('click', () => {
    const next = effective() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* almacenamiento no disponible */ }
    syncToggle();
  });
  darkMq.addEventListener?.('change', syncToggle);
}

/* Copiar email */
$$<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const original = btn.textContent;
  btn.hidden = false;
  btn.addEventListener('click', () => {
    const email = btn.dataset.copy!;
    const ok = () => {
      btn.textContent = btn.dataset.done ?? '✓';
      setTimeout(() => { btn.textContent = original; }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(ok, () => { location.href = `mailto:${email}`; });
    else location.href = `mailto:${email}`;
  });
});

/* Cursor acompañante: solo puntero fino y sin reduced motion */
const cur = $('#cur');
if (cur && !reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let x = 0, y = 0, tx = 0, ty = 0, live = false;
  const loop = () => {
    if (!live) return;
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    cur.style.transform = `translate(${x}px,${y}px)`;
    requestAnimationFrame(loop);
  };
  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!live) { live = true; x = tx; y = ty; cur.classList.add('show'); loop(); }
    const t = (e.target as Element).closest?.('[data-cursor]') as HTMLElement | null;
    cur.classList.toggle('big', !!t);
    cur.textContent = t ? t.dataset.cursor ?? '' : '';
  }, { passive: true });
  addEventListener('pointerdown', () => cur.classList.add('dn'));
  addEventListener('pointerup', () => cur.classList.remove('dn'));
  document.addEventListener('mouseleave', () => { cur.classList.remove('show'); live = false; });
}
