import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import reservas from '../assets/shots/sportapp-reservas.png';
import dashboard from '../assets/shots/sportapp-dashboard.png';
import gInicio from '../assets/shots/grafika-inicio.webp';
import gArticulo from '../assets/shots/grafika-articulo.webp';
import gBuscar from '../assets/shots/grafika-buscar.webp';
import gGlosario from '../assets/shots/grafika-glosario.webp';
import gMovil from '../assets/shots/grafika-movil-inicio.webp';

/* Capturas reales tomadas en local.
   SportApp: panel web con datos de ejemplo (nombres ficticios, sin backend real).
   Grafika: copia local del repositorio público, sin peticiones a servicios externos salvo las fuentes. */
export type Shot = { src: ImageMetadata; url: string; alt: Record<Lang, string>; caption: Record<Lang, string> };

const sportReservas: Shot = {
  src: reservas, url: 'panel / reservas',
  alt: { es: 'Captura del panel web de SportApp: bandeja de reservas con cliente, cancha, horario, precio, estado y botones para confirmar, rechazar o completar', en: 'Screenshot of the SportApp web panel: bookings inbox with customer, court, time, price, status and buttons to confirm, reject or complete' },
  caption: { es: 'Bandeja de reservas, con datos de ejemplo.', en: 'Bookings inbox, with sample data.' },
};
const sportDashboard: Shot = {
  src: dashboard, url: 'panel / dashboard',
  alt: { es: 'Captura del panel web de SportApp: resumen del complejo con reservas de hoy, pendientes, confirmadas e ingresos estimados', en: 'Screenshot of the SportApp web panel: venue summary with today’s bookings, pending, confirmed and estimated revenue' },
  caption: { es: 'Panel del complejo, en local y con datos de ejemplo.', en: 'Venue panel, run locally with sample data.' },
};

export const shots: Record<string, { home?: Shot; detail?: Shot }> = {
  sportapp: { home: sportReservas, detail: sportDashboard },
};

/** Galerías: la primera captura es la principal; el resto se abre en el visor. */
export const galleries: Record<string, Shot[]> = {
  sportapp: [sportDashboard, sportReservas],
  grafika: [
    {
      src: gInicio, url: 'grafika / inicio',
      alt: { es: 'Captura de Grafika: portada con el buscador, accesos a clases y una composición geométrica de colores', en: 'Screenshot of Grafika: home page with the search box, links to classes and a colorful geometric composition' },
      caption: { es: 'Portada con buscador.', en: 'Home page with search.' },
    },
    {
      src: gArticulo, url: 'grafika / artículo',
      alt: { es: 'Captura de Grafika: guía de Psicología del color con índice lateral, cuerpo del artículo y temas relacionados', en: 'Screenshot of Grafika: the Color psychology guide with a side index, article body and related topics' },
      caption: { es: 'Guía de clase generada desde Markdown, con índice lateral.', en: 'Class guide rendered from Markdown, with a side index.' },
    },
    {
      src: gBuscar, url: 'grafika / buscar',
      alt: { es: 'Captura de Grafika: búsqueda de «tipografia» sin tilde que sugiere una guía, una clase y dos términos del glosario', en: 'Screenshot of Grafika: a search for “tipografia” without the accent suggesting a guide, a class and two glossary terms' },
      caption: { es: 'Búsqueda sin tilde: sugiere guía, clase y glosario.', en: 'Accent-insensitive search: suggests a guide, a class and glossary terms.' },
    },
    {
      src: gGlosario, url: 'grafika / glosario',
      alt: { es: 'Captura de Grafika: glosario académico con 40 términos, filtro por letra y tarjetas de definiciones', en: 'Screenshot of Grafika: academic glossary with 40 terms, a letter filter and definition cards' },
      caption: { es: 'Glosario de 40 términos con filtro por letra.', en: '40-term glossary with a letter filter.' },
    },
    {
      src: gMovil, url: 'grafika / móvil',
      alt: { es: 'Captura de Grafika en un teléfono: portada con navegación deslizable y tarjetas de acceso', en: 'Screenshot of Grafika on a phone: home page with a scrollable nav and link cards' },
      caption: { es: 'La misma portada en el móvil.', en: 'The same home page on a phone.' },
    },
  ],
};
