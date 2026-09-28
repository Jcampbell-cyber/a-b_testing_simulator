import { canonical } from '../site';

export type JsonLd = Record<string, unknown>;

/** schema.org BreadcrumbList from on-screen breadcrumbs (the last item is the current page) */
export function breadcrumbJsonLd(items: { label: string; to?: string }[], currentPath: string): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: canonical(item.to ?? currentPath),
    })),
  };
}
