import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: z.object({
    key: z.string(),
    lang: z.enum(['es', 'en']),
    /** 'case' = caso propio en la sección Trabajo; 'academic' = se muestra en Experiencia con enlace al detalle. */
    kind: z.enum(['case', 'academic']).default('case'),
    order: z.number(),
    title: z.string(),
    /** Antetítulo técnico (servicios principales), el mismo en la home y en el caso. */
    subtitle: z.string().optional(),
    short: z.string(),
    label: z.string(),
    period: z.string(),
    summary: z.string(),
    problem: z.string(),
    decision: z.string(),
    role: z.string(),
    result: z.string(),
    /** Etiqueta corta para la consola del hero. */
    tag: z.string(),
    stack: z.array(z.string()),
    sticker: z.object({ value: z.string(), label: z.string() }),
    color: z.enum(['wine', 'bg', 'teal', 'surface', 'invert', 'red']),
    /** Huella técnica: conteos verificables sobre los repositorios (research/metricas-tecnicas.md). Opcional. */
    footprint: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    /** Cifras reales de impacto de negocio. Opcional: si está vacío, la sección de métricas no se renderiza. */
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    /** Versión en lenguaje llano para la home (sin nombres de servicios). El detalle técnico queda en la página del caso. */
    home: z.object({
      summary: z.string(),
      problem: z.string(),
      result: z.string(),
      tags: z.array(z.string()).max(3),
      sticker: z.object({ value: z.string(), label: z.string() }),
    }).optional(),
  }),
});

const side = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/side' }),
  schema: z.object({
    lang: z.enum(['es', 'en']),
    order: z.number(),
    title: z.string(),
    kind: z.string(),
    role: z.string(),
    year: z.string(),
    stack: z.array(z.string()),
    link: z.string().url().optional(),
    /** Galería de capturas reales (clave en src/lib/shots.ts). */
    gallery: z.string().optional(),
    /** Resumen llano para la tarjeta; el cuerpo y el stack quedan en «Detalle técnico». */
    summary: z.string(),
    tags: z.array(z.string()).max(3),
  }),
});

export const collections = { cases, side };
