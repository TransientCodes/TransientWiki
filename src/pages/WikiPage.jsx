import React, { useEffect, useState } from 'react';
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
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const entry = getContentEntryBySlug(slug);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (entry) {
          const markdown = await loadContentByEntry(entry);
          setContent(markdown);
        } else {
          setError('Page not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading page');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [entry]);

  const seo = getPageMetadata({
    content,
    entry,
    isNotFound: Boolean(error),
    pathname,
  });

  if (loading) {
    return (
      <>
        <Seo {...seo} />
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-accent)' }}>
          Loading...
        </div>
      </>
    );
  }

  if (error) {
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
