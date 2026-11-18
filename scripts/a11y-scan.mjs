// Escaneo de accesibilidad: construye el sitio, levanta `astro preview` y recorre todas las páginas ES/EN
// en tema claro y oscuro (forzando data-theme) a 375 y 1300 px. Ejecuta axe (color-contrast y reglas WCAG A/AA)
// y guarda capturas de página completa en .scan/ (ignorada por git).
// Uso: npm run scan            (SKIP_BUILD=1 para reutilizar dist/)
// Sale con código 1 si hay violaciones de contraste.
import { spawn, execSync } from 'node:child_process';
import { readdirSync, statSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const outDir = join(root, '.scan');
const PORT = Number(process.env.SCAN_PORT ?? 4399);
const base = `http://localhost:${PORT}`;

if (!process.env.SKIP_BUILD) execSync('npm run build', { cwd: root, stdio: 'inherit' });

/** Rutas de todas las páginas HTML generadas, salvo la raíz (solo redirige al idioma). */
function pages(dir) {
  const found = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) found.push(...pages(p));
    else if (name.endsWith('.html')) {
      const rel = '/' + relative(dist, p).split(sep).join('/');
      if (rel === '/index.html') continue;
      found.push(rel === '/404.html' ? '/404.html' : rel.replace(/index\.html$/, ''));
    }
  }
  return found.sort();
}

const routes = pages(dist);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { cwd: root, stdio: 'pipe' });
const stop = () => { try { server.kill(); } catch { /* ya terminó */ } };
process.on('exit', stop);

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(base + '/es/'); if (r.ok) return; } catch { /* aún no */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('astro preview no respondió');
}
await waitForServer();

const browser = await chromium.launch();
const themes = ['light', 'dark'];
const widths = [375, 1300];
const contrast = [];
const other = new Map();
let incomplete = 0;

for (const theme of themes) {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    await ctx.addInitScript((t) => {
      try { localStorage.setItem('theme', t); } catch { /* sin almacenamiento */ }
      document.documentElement.setAttribute('data-theme', t);
    }, theme);
    const page = await ctx.newPage();
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in')));
      // Fuerza la carga de las imágenes diferidas para que entren en el análisis y en las capturas.
      await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }));
      await page.waitForLoadState('networkidle');
      // Las tramas decorativas (halftone, telaraña) son imágenes de fondo con ≤ 9 % de opacidad y axe no puede medir
      // contraste sobre ellas. Para el análisis se quitan y se mide contra el color sólido que tienen debajo.
      const noPatterns = await page.addStyleTag({ content: '*, *::before, *::after { background-image: none !important; }' });
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      for (const v of res.violations) {
        if (v.id === 'color-contrast') {
          for (const n of v.nodes) contrast.push({ route, theme, width, target: n.target.join(' '), summary: n.failureSummary?.split('\n').slice(1).join(' ').trim() });
        } else {
          const key = `${v.id} · ${route}`;
          other.set(key, (other.get(key) ?? 0) + v.nodes.length);
        }
      }
      incomplete += res.incomplete.filter((v) => v.id === 'color-contrast').reduce((n, v) => n + v.nodes.length, 0);
      await noPatterns.evaluate((el) => el.remove());
      const file = `${route.replace(/^\/|\/$/g, '').replace(/[/.]/g, '_') || 'root'}--${theme}-${width}.png`;
      await page.screenshot({ path: join(outDir, file), fullPage: true });
    }
    await ctx.close();
  }
}
await browser.close();
stop();

writeFileSync(join(outDir, 'report.json'), JSON.stringify({ routes, contrast, other: Object.fromEntries(other), incomplete }, null, 2));
console.log(`\nPáginas: ${routes.length} × ${themes.length} temas × ${widths.length} anchos = ${routes.length * 4} vistas`);
console.log(`Violaciones de contraste: ${contrast.length}`);
for (const c of contrast.slice(0, 40)) console.log(`  ${c.route} [${c.theme} ${c.width}] ${c.target} — ${c.summary}`);
console.log(`Contraste sin determinar por axe (fondos con imagen, etc.): ${incomplete}`);
if (other.size) {
  console.log('Otras violaciones WCAG A/AA:');
  for (const [k, n] of other) console.log(`  ${k}: ${n}`);
}
console.log(`Capturas e informe en ${relative(root, outDir)}/`);
process.exit(contrast.length ? 1 : 0);
