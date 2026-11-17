import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Case = CollectionEntry<'cases'>;

/** Todas las entradas (casos propios y académicos) de un idioma, ordenadas. */
export async function getAllCases(lang: Lang): Promise<Case[]> {
  const all = await getCollection('cases', (e) => e.data.lang === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Solo los casos propios de la sección Trabajo. */
export async function getCases(lang: Lang): Promise<Case[]> {
  return (await getAllCases(lang)).filter((c) => c.data.kind === 'case');
}

export async function getSide(lang: Lang) {
  const all = await getCollection('side', (e) => e.data.lang === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Clases de contexto de color para un bloque de caso. */
export function blockClass(color: Case['data']['color']) {
  const fill = color === 'wine' || color === 'red';
  return `c-${color}${color === 'invert' ? ' invert' : ''}${color === 'teal' ? ' on-teal' : ''}${fill ? ' on-fill' : ''}`;
}
