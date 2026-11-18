import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import reservas from '../assets/shots/sportapp-reservas.png';
import dashboard from '../assets/shots/sportapp-dashboard.png';

/* Capturas reales del panel web de SportApp, tomadas en local con datos de ejemplo (nombres ficticios, sin backend real). */
export type Shot = { src: ImageMetadata; url: string; alt: Record<Lang, string>; caption: Record<Lang, string> };

export const shots: Record<string, { home?: Shot; detail?: Shot }> = {
  sportapp: {
    home: {
      src: reservas, url: 'panel / reservas',
      alt: { es: 'Captura del panel web de SportApp: bandeja de reservas con cliente, cancha, horario, precio, estado y botones para confirmar, rechazar o completar', en: 'Screenshot of the SportApp web panel: bookings inbox with customer, court, time, price, status and buttons to confirm, reject or complete' },
      caption: { es: 'Panel web real, con datos de ejemplo.', en: 'The real web panel, with sample data.' },
    },
    detail: {
      src: dashboard, url: 'panel / dashboard',
      alt: { es: 'Captura del panel web de SportApp: resumen del complejo con reservas de hoy, pendientes, confirmadas e ingresos estimados', en: 'Screenshot of the SportApp web panel: venue summary with today’s bookings, pending, confirmed and estimated revenue' },
      caption: { es: 'Panel del complejo, en local y con datos de ejemplo.', en: 'Venue panel, run locally with sample data.' },
    },
  },
};
