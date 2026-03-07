import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = () => {
    const { pathname } = useLocation();
    const parts = pathname.replace(/^\/wiki\//, '').split('/').filter(Boolean);

    // Only show for nested paths (Folder/Page)
    if (parts.length < 2) return null;

    const folder = parts[0];
    const page = parts[parts.length - 1];
    const folderLabel = folder.charAt(0).toUpperCase() + folder.slice(1).replace(/-/g, ' ');
    const pageLabel = page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ');

    return (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <span className={styles.crumb}>Wiki</span>
            <span className={styles.sep}>›</span>
            <span className={styles.crumb}>{folderLabel}</span>
            <span className={styles.sep}>›</span>
            <span className={`${styles.crumb} ${styles.current}`}>{pageLabel}</span>
        </nav>
    );
};

export default Breadcrumbs;
