/* Comportamiento compartido: barra de progreso, revelado, nav activa, tema, copiar email y carga diferida de efectos. */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s as any) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s as any)) as T[];

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

/* Efectos interactivos (escena 3D, tilt, diagramas, visor de capturas): el módulo se descarga solo cuando
   el primer elemento [data-fx] se acerca a la pantalla, sin bloquear el render inicial. */
const fxTargets = $$('[data-fx]');
if (fxTargets.length) {
  let loaded = false;
  const load = () => {
    if (loaded) return;
    loaded = true;
    import('./fx').then((m) => m.init()).catch(() => { /* sin efectos: el contenido estático sigue funcionando */ });
  };
  if ('IntersectionObserver' in window) {
    const fo = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { fo.disconnect(); load(); } }, { rootMargin: '200px 0px' });
    fxTargets.forEach((el) => fo.observe(el));
  } else load();
}
