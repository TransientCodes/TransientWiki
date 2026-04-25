import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import {
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
    jsonLd: getJsonLd(meta),
  };
}

export function getPrerenderRoutes() {
  return SITEMAP_PAGES.map((page) => page.path);
}
