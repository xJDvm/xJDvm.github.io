# Portafolio · Juan Diego Valdés M.

Sitio estático con Astro 5 y TypeScript, en español (`/es/`) e inglés (`/en/`), con tema claro y oscuro (sigue `prefers-color-scheme` y tiene un botón que guarda la elección). El CSS es nativo con tokens y la única isla de Preact es la consola de API del hero. Los casos de estudio están en MDX.

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/
npm run check     # tipos y diagnóstico de Astro
SITE_URL=https://tu-dominio npm run build   # dominio propio (por defecto https://xjdvm.github.io) para canonical, OG, hreflang y sitemap
node scripts/make-images.mjs                # regenera public/og.png y apple-touch-icon.png
```

## Dónde editar

- **Textos de la home, en los dos idiomas:** `src/i18n/index.ts`. Incluye hero (con el logro del Nexus Challenge), experiencia en equipo, proyectos universitarios, formación, idiomas, habilidades, proceso, stack, sobre mí (con el kit diario de herramientas con IA) y contacto, además del email, GitHub y los futuros LinkedIn y CV.
- **Decisiones de ingeniería (sección 01 de la home y bloque al inicio de cada caso):** `src/i18n/decisions.ts`. Cada una lleva problema, alternativas, decisión, por qué y trade-off; el campo `case` la muestra también en la página del caso. Las cifras de costo son solo estimaciones de precio de lista de los documentos de cada proyecto (`figure.kind: 'estimate'`) o mediciones (`'measured'`); nunca ahorros facturados.
- **Casos propios:** `src/content/cases/{es,en}/*.mdx`. Llevan `kind: case`; la tesis lleva `kind: academic` y se enlaza desde Experiencia. El campo opcional `metrics: [{ value, label }]` muestra las cifras de impacto y, si está vacío, no se renderiza.
- **Selección de proyectos (no es la lista completa; el trabajo de clientes y privado queda fuera por confidencialidad):** `src/content/side/{es,en}/*.md`, con tipo, rol, año, stack y enlace opcional.
- **Ilustraciones de cada caso (SVG en línea, colores con variables CSS por tema):** `src/components/CaseArt.astro`.
- **Diseño y temas:** `src/styles/global.css`, con los tokens y el contraste documentados arriba del archivo. La referencia es `proposals/c-expressive/DESIGN.md`.
- **Consola interactiva:** `src/components/ApiConsole.tsx`. Es una simulación en el navegador y no hay backend.

## Pendiente de confirmar por el usuario

- **Experiencia.** El sitio dice 4 años programando y 2,5 años con IA (dato del usuario, noviembre de 2026); hay que actualizarlo con el tiempo en `src/i18n/index.ts` y en el JSON de la consola (`src/components/Home.astro`).
- **Nexus Challenge.** Solo consta «ganador»; Intelix y AWS Kiro se nombran solo en ese logro, por petición del usuario.

- **Dominio final.** Por defecto se publica en `https://xjdvm.github.io`; con dominio propio, construir con `SITE_URL`.
- **LinkedIn y CV en PDF.** No se publican hasta tenerlos; están como TODO.
- **Cifras de impacto por caso.** Se rellenan en `metrics`.
- **CDLF.** Está en producción (lo confirmó el usuario) y faltan sus cifras.
- **Titulación y graduación.** Falta confirmar si se terminaron ambas carreras (UJAP 2022–2025, U. Tecnológica del Centro 2020–2024) y si hay certificaciones.
- **Permisos.** Falta el visto bueno para nombrar a CDLF y para describir de forma genérica el trabajo para el cliente retail.
