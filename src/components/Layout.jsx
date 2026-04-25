import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, Search as SearchIcon, X } from 'lucide-react';
import styles from './Layout.module.css';
import Sidebar from './Sidebar.jsx';
import Search from './Search.jsx';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setProgress(Math.min(100, Math.max(0, pct)));
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(0));
    if (contentRef.current) contentRef.current.scrollTop = 0;
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (
        e.key === '/' &&
        !isSearchOpen &&
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA' &&
        !e.target.isContentEditable
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isSearchOpen]);

  return (
    <div className={styles.container}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      <header className={styles.header}>
        <button className={styles.menuButton} onClick={toggleSidebar} aria-label="Menü umschalten">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={styles.branding}>
          <img src="/logo.png" alt="TransientRealm Wiki Logo" className={styles.logo} />
          <Link to="/" className={styles.title}>
            TransientRealm Wiki
          </Link>
        </div>
        <button
          className={styles.searchButton}
          onClick={() => setIsSearchOpen(true)}
          aria-label="Suchen"
        >
          <SearchIcon size={15} />
          <span className={styles.searchLabel}>Suchen</span>
          <kbd className={styles.searchKbd}>/</kbd>
        </button>
      </header>

      <div className={styles.main}>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className={styles.content} ref={contentRef} onScroll={handleScroll}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>

      {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
};

export default Layout;
