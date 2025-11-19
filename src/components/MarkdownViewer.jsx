import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import rehypeRaw from 'rehype-raw';
import styles from './MarkdownViewer.module.css';

const MarkdownViewer = ({ content }) => {
    return (
        <div className={styles.markdown}>
            <ReactMarkdown
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
    );
};

export default MarkdownViewer;
