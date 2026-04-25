import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import MarkdownViewer from '../components/MarkdownViewer';
import Seo from '../components/Seo';
import { getContentEntryBySlug, loadContentByEntry } from '../content/contentIndex';
import { getPageMetadata } from '../seo/pageMetadata';

const WikiPage = () => {
  const params = useParams();
  const { pathname } = useLocation();
  const slug = params['*'];
  const entry = getContentEntryBySlug(slug);
  const content = entry ? loadContentByEntry(entry) : '';
  const isNotFound = !entry;

  const seo = getPageMetadata({
    content,
    entry,
    isNotFound,
    pathname,
  });

  if (isNotFound) {
    return (
      <>
        <Seo {...seo} />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: 'var(--color-accent)' }}>404 - Seite nicht gefunden</h2>
          <p>Nutze die Suche oder gehe zurück zur Startseite, um passende Wiki-Inhalte zu finden.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo {...seo} />
      <Breadcrumbs />
      <MarkdownViewer content={content} />
    </>
  );
};

export default WikiPage;
