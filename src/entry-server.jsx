import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import {
  CONTENT_ENTRIES,
  getContentEntryByRoute,
  loadContentByEntry,
} from './content/contentIndex.js';
import {
  getJsonLd,
  getPageMetadata,
  SITEMAP_PAGES,
} from './seo/pageMetadata.js';

export function render(pathname) {
  return renderToString(<App location={pathname} />);
}

export function getSeo(pathname) {
  const entry = getContentEntryByRoute(pathname);
  const content = entry ? loadContentByEntry(entry) : '';
  const meta = getPageMetadata({
    content,
    entry,
    isNotFound: !entry,
    pathname,
  });

  return {
    ...meta,
    jsonLd: getJsonLd(meta, { content, entry }),
  };
}

export function getPrerenderRoutes() {
  return Array.from(
    new Set([
      ...SITEMAP_PAGES.map((page) => page.path),
      ...CONTENT_ENTRIES.map((entry) => entry.route),
    ]),
  ).sort((left, right) => {
    if (left === '/') return -1;
    if (right === '/') return 1;
    return left.localeCompare(right, 'de');
  });
}

export function getSitemapRoutes() {
  return SITEMAP_PAGES.map((page) => page.path);
}
