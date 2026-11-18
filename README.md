# Portafolio · Juan Diego Valdés M.

Sitio estático con Astro 5 y TypeScript, en español (`/es/`) e inglés (`/en/`), con tema claro y oscuro (sigue `prefers-color-scheme` y tiene un botón que guarda la elección). El CSS es nativo con tokens. La única isla de Preact es la consola de API de «Cómo decido» (se hidrata al entrar en pantalla). Los efectos interactivos (escena 3D en CSS, tilt, diagramas y visor de capturas) viven en `src/scripts/fx.ts`, que se descarga solo cuando hace falta (≈1,9 KB gzip). Los iconos se empaquetan en el build, sin CDN; créditos y licencias en `THIRD_PARTY_NOTICES.md`. Los casos de estudio están en MDX.

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/
npm run check     # tipos y diagnóstico de Astro
npm run scan      # build + axe (contraste y WCAG A/AA) en todas las páginas ES/EN, tema claro y oscuro, 375 y 1300 px; capturas en .scan/
SITE_URL=https://tu-dominio npm run build   # dominio propio (por defecto https://xjdvm.github.io) para canonical, OG, hreflang y sitemap
node scripts/make-images.mjs                # regenera public/og.png y apple-touch-icon.png
```

## Dónde editar

- **Textos de la home, en los dos idiomas:** `src/i18n/index.ts`. Incluye hero (rol, stack principal, modalidad remota y tres pruebas que enlazan a los casos), los principios de cada caso (`think.items`), los cuatro hábitos de «Cómo decido» (`steps`), experiencia, formación compacta, stack, sobre mí y contacto, además del email, GitHub, LinkedIn y el CV pendiente (TODO).
- **Home en lenguaje llano:** el bloque `home` del frontmatter de cada caso (resumen, problema, resultado, hasta 3 etiquetas genéricas y dato destacado; el título es el mismo `title` de la página del caso, con `subtitle` como antetítulo técnico) y `summary`/`tags` de cada proyecto de la selección. El detalle técnico (stack, huella, diagramas, decisiones con servicios y costos) vive en las páginas de caso, en «Detalle técnico» de cada tarjeta y en `/es/decisiones/` · `/en/decisions/`.
- **Decisiones de ingeniería (página de detalle y bloque al inicio de cada caso):** `src/i18n/decisions.ts`. Cada una lleva problema, alternativas, decisión, por qué y trade-off; el campo `case` la muestra también en la página del caso. Las cifras de costo son solo estimaciones de precio de lista de los documentos de cada proyecto (`figure.kind: 'estimate'`) o mediciones (`'measured'`); nunca ahorros facturados.
- **Casos propios:** `src/content/cases/{es,en}/*.mdx`. Llevan `kind: case`; la tesis lleva `kind: academic` y se enlaza desde Experiencia. El campo opcional `metrics: [{ value, label }]` muestra las cifras de impacto y, si está vacío, no se renderiza.
- **Otros proyectos (no es la lista completa; el trabajo de clientes y privado queda fuera por confidencialidad):** `src/content/side/{es,en}/*.md`, con tipo, rol, año, stack, enlace y galería opcionales. La home muestra los tres primeros por `order` como tarjetas y el resto en una línea.
- **Ilustraciones de cada caso (SVG en línea, colores con variables CSS por tema):** `src/components/CaseArt.astro`.
- **Diagramas de arquitectura:** `src/lib/flows.ts` (pasos de «Cómo funciona» en la home, «Arquitectura» en cada caso y en Friends Monitor y la plataforma B2B), dibujados por `src/components/Flow.astro`, interactivos con «Recorrer el flujo». Los iconos salen de `src/lib/cloud-icons.ts`: AWS Architecture Icons (`aws-icons`, MIT), Simple Icons (`simple-icons`, CC0) y Lucide (`lucide-static`, ISC).
- **Escena 3D del hero:** `src/components/Scene3D.astro` (CSS 3D, sin WebGL). Estática sin JS y con `prefers-reduced-motion`.
- **Capturas reales:** `src/assets/shots/` y `src/lib/shots.ts` (`galleries` para las galerías con visor). SportApp: panel web en local con datos de ejemplo y nombres ficticios. Grafika: copia local del repositorio público, sin el nombre de la docente. Astro genera AVIF/WebP responsivos con carga diferida.
- **Diseño y temas:** `src/styles/global.css`, con los tokens y el contraste documentados arriba del archivo. La referencia es `proposals/c-expressive/DESIGN.md`.
- **Consola interactiva:** `src/components/ApiConsole.tsx`, en la sección «Cómo decido». Es una simulación en el navegador y no hay backend.

## Pendiente de confirmar por el usuario

- **Experiencia.** El sitio dice 4 años de experiencia construyendo software (dato del usuario, noviembre de 2026); hay que actualizarlo con el tiempo en `src/i18n/index.ts` (hero, meta, sobre mí) y en el JSON de la consola (`src/components/Home.astro`).
- **Nexus Challenge.** Solo consta «ganador»; Intelix y AWS Kiro se nombran solo en ese logro, por petición del usuario.

- **Dominio final.** Por defecto se publica en `https://xjdvm.github.io`; con dominio propio, construir con `SITE_URL`.
- **LinkedIn y CV en PDF.** No se publican hasta tenerlos; están como TODO.
- **Cifras de impacto por caso.** Se rellenan en `metrics` (no hay ninguna inventada).
- **Enlace verificable del Nexus Challenge y testimonios.** No se publican hasta tenerlos.
- **Caso de la clínica.** Se nombra solo como «una clínica» (slug `/es/proyectos/clinica/` · `/en/projects/clinic/`, definido en `caseSlug` de `src/i18n/index.ts`); faltan sus cifras.
- **Titulación y graduación.** Falta confirmar si se terminaron ambas carreras (UJAP 2022–2025, U. Tecnológica del Centro 2020–2024) y si hay certificaciones.
- **Permisos.** Falta el visto bueno para describir de forma genérica el trabajo para el cliente retail.
