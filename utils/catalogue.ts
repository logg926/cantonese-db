import type { SortOption, WorkItem } from '../types';

export const durationMinutes = (value: string): number | null => {
  const text = value.trim();
  if (!/^\d+(?:\.\d+)?$/.test(text)) return null;
  const minutes = Number(text);
  return Number.isFinite(minutes) ? minutes : null;
};

export const formatDuration = (value: string): string => {
  const minutes = durationMinutes(value);
  return minutes === null ? 'unspecified' : `${minutes} min`;
};

export const matchesDuration = (value: string, [min, max]: [number, number]): boolean => {
  const minutes = durationMinutes(value);
  return minutes === null || (minutes >= min && (max === 10 || minutes <= max));
};

// A placeholder such as "issuu" or "OUT OF PRINT" is not a preview link.
export const mediaUrl = (value: string): string | null => {
  try {
    const url = new URL(value.trim());
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};

export const matchesExplore = (item: Pick<WorkItem, 'link' | 'perusalScore'>, selected: string[]): boolean =>
  selected.every(kind => !!mediaUrl(kind === 'audio' ? item.link : item.perusalScore));

export const compareWorks = (a: WorkItem, b: WorkItem, sort: SortOption): number => {
  if (sort === 'year-desc') return b.year - a.year;
  if (sort === 'year-asc') return a.year - b.year;
  const comparison = a.id.localeCompare(b.id, 'en', { numeric: true });
  return sort === 'id-desc' ? -comparison : comparison;
};
