import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import styles from './Search.module.css';
import { CONTENT_ENTRIES, loadContentByEntry } from '../content/contentIndex';

function stripMarkdown(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/#+\s+/g, '')
    .replace(/[*_~`]+/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTitle(content, entry) {
  const firstLine = content.split('\n').find((line) => line.startsWith('# '));
  if (firstLine) return firstLine.replace(/^#\s+/, '');
  const htmlHeadingMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (htmlHeadingMatch?.[1]) return htmlHeadingMatch[1].trim();
  return entry.title;
}

function getSnippet(content, query) {
  const clean = stripMarkdown(content);
  const lower = clean.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  const raw =
    idx === -1
      ? clean.slice(0, 120)
      : clean.slice(Math.max(0, idx - 40), idx + query.length + 80);
  return `${idx > 40 ? '…' : ''}${raw}…`;
}

const Search = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSelectedIndex(-1));
    return () => window.cancelAnimationFrame(frame);
  }, [results]);

  const handleSelect = useCallback((route) => {
    navigate(route);
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((value) => Math.min(value + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((value) => Math.max(value - 1, -1));
      }
      if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex].route);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSelect, onClose, results, selectedIndex]);

  const buildIndex = useCallback(async () => {
    if (index) return index;

    setLoading(true);
    const entries = await Promise.all(
      CONTENT_ENTRIES.map(async (entry) => {
        const content = await loadContentByEntry(entry);
        return {
          clean: stripMarkdown(content),
          content,
          route: entry.route,
          title: getTitle(content, entry),
        };
      }),
    );
    setLoading(false);
    setIndex(entries);
    return entries;
  }, [index]);

  useEffect(() => {
    if (!query.trim()) {
      const frame = window.requestAnimationFrame(() => setResults([]));
      return () => window.cancelAnimationFrame(frame);
    }

    (async () => {
      const entries = await buildIndex();
      const q = query.toLowerCase();
      const matched = entries
        .filter((entry) => entry.title.toLowerCase().includes(q) || entry.clean.toLowerCase().includes(q))
        .slice(0, 7)
        .map((entry) => ({
          route: entry.route,
          snippet: getSnippet(entry.content, query),
          title: entry.title,
        }));
      setResults(matched);
    })();
  }, [query, buildIndex]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <SearchIcon size={16} className={styles.icon} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.close} onClick={onClose} aria-label="Schließen">
            <X size={16} />
          </button>
        </div>

        {loading && <div className={styles.empty}>Lade…</div>}

        {!loading && query && results.length === 0 && (
          <div className={styles.empty}>Keine Ergebnisse für „{query}“</div>
        )}

        {results.length > 0 && (
          <ul className={styles.results} ref={listRef}>
            {results.map((result, resultIndex) => (
              <li key={result.route}>
                <button
                  className={`${styles.result} ${resultIndex === selectedIndex ? styles.resultActive : ''}`}
                  onClick={() => handleSelect(result.route)}
                  onMouseEnter={() => setSelectedIndex(resultIndex)}
                >
                  <span className={styles.resultTitle}>{result.title}</span>
                  <span className={styles.resultSnippet}>{result.snippet}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!query && !loading && (
          <div className={styles.empty}>Tipp eingeben, um zu suchen</div>
        )}
      </div>
    </div>
  );
};

export default Search;
