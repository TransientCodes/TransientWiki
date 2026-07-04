import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import styles from './Search.module.css';
import { CONTENT_ENTRIES, getCategoryForRoute, loadContentByEntry } from '../content/contentIndex';

// Häufige Spieler-Begriffe, die im Content anders heißen
const QUERY_ALIASES = {
  heimat: ['home'],
  zuhause: ['home'],
  geld: ['pfund', 'währung'],
  money: ['pfund', 'währung'],
  ip: ['adresse', 'transientrealm.de'],
  server: ['adresse'],
  gilde: ['kult'],
  clan: ['kult'],
  beruf: ['job'],
  quest: ['quests'],
};

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function stripMarkdown(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/#+\s+/g, '')
    .replace(/[*_~`]+/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTitle(content, entry) {
  // Kuratierter SEO-Titel zuerst — Content-H1s können Abschnittstitel
  // sein (Regelwerk: "# **§1 – Allgemein**") oder Markdown enthalten.
  if (entry.title) return entry.title;
  const firstLine = content.split('\n').find((line) => line.startsWith('# '));
  if (firstLine) return stripMarkdown(firstLine);
  const htmlHeadingMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (htmlHeadingMatch?.[1]) return htmlHeadingMatch[1].trim();
  return entry.relativePath;
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
  const requestIdRef = useRef(0);
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
          category: getCategoryForRoute(entry.route, entry),
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

    const requestId = ++requestIdRef.current;
    (async () => {
      const entries = await buildIndex();
      if (requestId !== requestIdRef.current) return;
      const q = query.toLowerCase().trim();
      const terms = [q, ...(QUERY_ALIASES[q] ?? [])];

      // Ranking: exakter Titel < Titel-Anfang < Titel enthält < nur Volltext;
      // bei gleichem Rang gewinnt die Seite mit den meisten Fundstellen
      const rank = (entry) => {
        let best = Infinity;
        let freq = 0;
        const title = entry.title.toLowerCase();
        const clean = entry.clean.toLowerCase();
        for (const term of terms) {
          if (title === term) best = Math.min(best, 0);
          else if (title.startsWith(term)) best = Math.min(best, 1);
          else if (title.includes(term)) best = Math.min(best, 2);
          else if (clean.includes(term)) best = Math.min(best, 3);
          freq += countOccurrences(clean, term);
        }
        return { best, freq };
      };

      const matched = entries
        .map((entry) => ({ entry, ...rank(entry) }))
        .filter((item) => item.best !== Infinity)
        .sort((left, right) => left.best - right.best || right.freq - left.freq)
        .slice(0, 7)
        .map(({ entry }) => ({
          category: entry.category,
          route: entry.route,
          snippet: getSnippet(entry.content, terms.find((t) => entry.clean.toLowerCase().includes(t)) ?? q),
          title: entry.title,
        }));
      setResults(matched);
    })();
  }, [query, buildIndex]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Wiki-Suche"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.inputRow}>
          <SearchIcon size={16} className={styles.icon} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Suchen…"
            aria-label="Wiki durchsuchen"
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
                  <span className={styles.resultHead}>
                    <span className={styles.resultTitle}>{result.title}</span>
                    {result.category && (
                      <span className={styles.resultCat}>{result.category}</span>
                    )}
                  </span>
                  <span className={styles.resultSnippet}>{result.snippet}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!query && !loading && (
          <div className={styles.empty}>Tippe einen Suchbegriff — z. B. „Jobs" oder „Plot"</div>
        )}
      </div>
    </div>
  );
};

export default Search;
