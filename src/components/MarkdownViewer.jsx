import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import rehypeRaw from 'rehype-raw';
import { Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './MarkdownViewer.module.css';
import Lightbox from './Lightbox.jsx';
import { slugifySegment } from '../content/contentIndex';

function slugify(text) {
  return String(text)
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function childrenToText(children) {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') {
        return child;
      }

      if (Array.isArray(child?.props?.children)) {
        return childrenToText(child.props.children);
      }

      return child?.props?.children ?? '';
    })
    .join('');
}

function makeHeading(Tag) {
  return function HeadingRenderer({ children, ...props }) {
    const slug = slugify(childrenToText(children));
    return (
      <div className={styles.headingWrapper}>
        <Tag id={slug} {...props}>
          {children}
        </Tag>
        <button
          className={styles.anchorLink}
          aria-label="Zu diesem Abschnitt scrollen"
          onClick={() => document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Hash size={14} />
        </button>
      </div>
    );
  };
}

const headingComponents = {
  h1: makeHeading('h1'),
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
};

const MarkdownViewer = ({ content }) => {
  const [lightbox, setLightbox] = useState(null);
  const navigate = useNavigate();

  const normalizeWikiHref = (href = '') => {
    if (href.startsWith('#/')) {
      return href.slice(1);
    }

    return href;
  };

  const components = {
    ...headingComponents,
    a({ href, children, ...props }) {
      const normalizedHref = normalizeWikiHref(href);

      if (normalizedHref?.startsWith('/wiki/') || normalizedHref === '/') {
        return (
          <a
            {...props}
            href={normalizedHref}
            onClick={(e) => {
              e.preventDefault();
              navigate(normalizedHref);
            }}
          >
            {children}
          </a>
        );
      }

      return <a href={normalizedHref} {...props}>{children}</a>;
    },
    img({ src, alt, ...props }) {
      return (
        <img
          src={src}
          alt={alt}
          {...props}
          style={{ cursor: 'zoom-in' }}
          onClick={() => setLightbox({ src, alt })}
        />
      );
    },
  };

  return (
    <>
      <div className={styles.markdown}>
        <ReactMarkdown
          components={components}
          remarkPlugins={[
            remarkGfm,
            [
              remarkWikiLink,
              {
                pageResolver: (name) => [name.split('/').map(slugifySegment).join('/')],
                hrefTemplate: (permalink) => `/wiki/${permalink}`,
                aliasDivider: '|',
              },
            ],
          ]}
          rehypePlugins={[rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </div>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
};

export default MarkdownViewer;
