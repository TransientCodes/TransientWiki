import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import rehypeRaw from 'rehype-raw';
import { Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './MarkdownViewer.module.css';
import Lightbox from './Lightbox.jsx';

function slugify(text) {
    return String(text)
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function childrenToText(children) {
    return React.Children.toArray(children)
        .map(c => (typeof c === 'string' ? c : (c?.props?.children ?? '')))
        .join('');
}

function makeHeading(Tag) {
    return function HeadingRenderer({ node, children, ...props }) {
        const slug = slugify(childrenToText(children));
        return (
            <div className={styles.headingWrapper}>
                <Tag id={slug} {...props}>{children}</Tag>
                <a
                    className={styles.anchorLink}
                    href={`#${slug}`}
                    aria-label="Link zu diesem Abschnitt"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <Hash size={14} />
                </a>
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

    const components = {
        ...headingComponents,
        // Intercept internal wiki links so they go through React Router instead
        // of native hash navigation (which breaks in Brave with strict shields).
        a({ node, href, children, ...props }) {
            if (href?.startsWith('#/')) {
                return (
                    <a
                        {...props}
                        href={href}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(href.slice(1)); // '#/wiki/page' → '/wiki/page'
                        }}
                    >
                        {children}
                    </a>
                );
            }
            return <a href={href} {...props}>{children}</a>;
        },
        img({ node, src, alt, ...props }) {
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
                        [remarkWikiLink, {
                            pageResolver: (name) => [name.replace(/ /g, '-').toLowerCase()],
                            hrefTemplate: (permalink) => `#/wiki/${permalink}`,
                            aliasDivider: '|'
                        }]
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
