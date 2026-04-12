import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';
import { getContentEntryByRoute } from '../content/contentIndex';

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const entry = getContentEntryByRoute(pathname);

  if (!entry?.isNested) return null;

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <Link to="/" className={styles.crumb}>
        Startseite
      </Link>
      <span className={styles.sep}>›</span>
      <span className={styles.crumb}>{entry.labels[0]}</span>
      <span className={styles.sep}>›</span>
      <span className={`${styles.crumb} ${styles.current}`}>{entry.title}</span>
    </nav>
  );
};

export default Breadcrumbs;
