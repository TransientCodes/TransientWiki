import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import rehypeRaw from 'rehype-raw';
import { Hash } from 'lucide-react';
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
                <a className={styles.anchorLink} href={`#${slug}`} aria-label="Link zu diesem Abschnitt">
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

    const components = {
        ...headingComponents,
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
