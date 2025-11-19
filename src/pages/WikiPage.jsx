import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownViewer from '../components/MarkdownViewer';

const WikiPage = () => {
    const params = useParams();
    const slug = params['*'];
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);

            const pageSlug = slug || 'home';

            try {
                // Dynamically import markdown files
                const modules = import.meta.glob('/src/content/**/*.md', { as: 'raw' });

                // Helper to normalize paths for comparison (removes special chars, spaces, invisible marks)
                const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

                const cleanSlug = pageSlug;
                const normalizedTarget = normalize(cleanSlug);

                // Find matching file
                const modulePath = Object.keys(modules).find(path => {
                    // Get the filename part (e.g. "Jobs-Allgemein.md")
                    const filename = path.split('/').pop().replace('.md', '');
                    // Get the full path without extension
                    const fullPath = path.replace('/src/content/', '').replace('.md', '');

                    // Check if normalized filename matches normalized target
                    // OR if normalized full path matches normalized target
                    return normalize(filename) === normalizedTarget ||
                        normalize(fullPath) === normalizedTarget;
                });

                if (modulePath) {
                    const markdown = await modules[modulePath]();
                    setContent(markdown);
                } else {
                    console.log('File not found for slug:', slug);
                    console.log('Normalized target:', normalizedTarget);
                    console.log('Available files:', Object.keys(modules));
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
    }, [slug]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-accent)' }}>Loading...</div>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ color: 'var(--color-accent)' }}>404 - Page Not Found</h2>
                <p>The page you are looking for seems to have been lost.</p>
            </div>
        );
    }

    return <MarkdownViewer content={content} />;
};

export default WikiPage;
