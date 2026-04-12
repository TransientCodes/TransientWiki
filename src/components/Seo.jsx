import { useEffect } from 'react';
import { DEFAULT_IMAGE, SITE_NAME } from '../seo/pageMetadata';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

const Seo = ({ canonical, description, robots, title, type }) => {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = 'de';

    upsertMeta('meta[name="description"]', {
      content: description,
      name: 'description',
    });
    upsertMeta('meta[name="robots"]', {
      content: robots,
      name: 'robots',
    });
    upsertMeta('meta[property="og:locale"]', {
      content: 'de_DE',
      property: 'og:locale',
    });
    upsertMeta('meta[property="og:site_name"]', {
      content: SITE_NAME,
      property: 'og:site_name',
    });
    upsertMeta('meta[property="og:type"]', {
      content: type,
      property: 'og:type',
    });
    upsertMeta('meta[property="og:title"]', {
      content: title,
      property: 'og:title',
    });
    upsertMeta('meta[property="og:description"]', {
      content: description,
      property: 'og:description',
    });
    upsertMeta('meta[property="og:url"]', {
      content: canonical,
      property: 'og:url',
    });
    upsertMeta('meta[property="og:image"]', {
      content: DEFAULT_IMAGE,
      property: 'og:image',
    });
    upsertMeta('meta[property="og:image:alt"]', {
      content: 'TransientRealm Wiki Logo',
      property: 'og:image:alt',
    });
    upsertMeta('meta[name="twitter:card"]', {
      content: 'summary_large_image',
      name: 'twitter:card',
    });
    upsertMeta('meta[name="twitter:title"]', {
      content: title,
      name: 'twitter:title',
    });
    upsertMeta('meta[name="twitter:description"]', {
      content: description,
      name: 'twitter:description',
    });
    upsertMeta('meta[name="twitter:image"]', {
      content: DEFAULT_IMAGE,
      name: 'twitter:image',
    });
    upsertLink('link[rel="canonical"]', {
      href: canonical,
      rel: 'canonical',
    });
  }, [canonical, description, robots, title, type]);

  return null;
};

export default Seo;
