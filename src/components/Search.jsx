import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import styles from './Search.module.css';

const allModules = import.meta.glob('/src/content/**/*.md', { query: '?raw', import: 'default' });

function stripMarkdown(text) {
    return text
        .replace(/<[^>]+>/g, ' ')       // HTML tags
        .replace(/#+\s+/g, '')           // headings
        .replace(/[*_~`]+/g, '')         // bold/italic/code markers
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // [text](url) → text
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')      // images
        .replace(/&[a-z]+;/gi, ' ')      // HTML entities
        .replace(/\s+/g, ' ')
        .trim();
}

function getTitle(content, path) {
    const firstLine = content.split('\n').find(l => l.startsWith('# '));
    if (firstLine) return firstLine.replace(/^#\s+/, '');
    const parts = path.replace('/src/content/', '').replace('.md', '').split('/');
    return parts[parts.length - 1];
}

function getSnippet(content, query) {
    const clean = stripMarkdown(content);
    const lower = clean.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());
    const raw = idx === -1 ? clean.slice(0, 120) : clean.slice(Math.max(0, idx - 40), idx + query.length + 80);
    return (idx > 40 ? '…' : '') + raw + '…';
}

function pathToRoute(path) {
    return `/wiki/${path.replace('/src/content/', '').replace('.md', '')}`;
}

const Search = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [index, setIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const buildIndex = useCallback(async () => {
        if (index) return index;
        setLoading(true);
        const entries = await Promise.all(
            Object.entries(allModules).map(async ([path, loader]) => {
                const content = await loader();
                return { path, content, clean: stripMarkdown(content), title: getTitle(content, path), route: pathToRoute(path) };
            })
        );
        setLoading(false);
        setIndex(entries);
        return entries;
    }, [index]);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        (async () => {
            const entries = await buildIndex();
            const q = query.toLowerCase();
            const matched = entries
                .filter(e => e.title.toLowerCase().includes(q) || e.clean.toLowerCase().includes(q))
                .slice(0, 7)
                .map(e => ({ title: e.title, route: e.route, snippet: getSnippet(e.content, query) }));
            setResults(matched);
        })();
    }, [query, buildIndex]);

    const handleSelect = (route) => {
        navigate(route);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.inputRow}>
                    <SearchIcon size={16} className={styles.icon} />
                    <input
                        ref={inputRef}
                        className={styles.input}
                        placeholder="Suchen…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button className={styles.close} onClick={onClose} aria-label="Schließen">
                        <X size={16} />
                    </button>
                </div>

                {loading && <div className={styles.empty}>Lade…</div>}

                {!loading && query && results.length === 0 && (
                    <div className={styles.empty}>Keine Ergebnisse für „{query}"</div>
                )}

                {results.length > 0 && (
                    <ul className={styles.results}>
                        {results.map(r => (
                            <li key={r.route}>
                                <button className={styles.result} onClick={() => handleSelect(r.route)}>
                                    <span className={styles.resultTitle}>{r.title}</span>
                                    <span className={styles.resultSnippet}>{r.snippet}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {!query && !loading && (
                    <div className={styles.empty}>Tipp eingeben um zu suchen</div>
                )}
            </div>
        </div>
    );
};

export default Search;
