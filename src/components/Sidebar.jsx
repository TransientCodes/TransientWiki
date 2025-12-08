import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Youtube, Mail, Shield } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose }) => {
    // Dynamically get all markdown files from src/content
    const modules = import.meta.glob('/src/content/**/*.md');

    const navigation = useMemo(() => {
        const files = Object.keys(modules);
        const structure = {
            topLevel: [],
            folders: {}
        };

        files.forEach(path => {
            // Remove /src/content/ prefix and .md suffix
            const cleanPath = path.replace('/src/content/', '').replace('.md', '');
            const parts = cleanPath.split('/');

            if (parts.length === 1) {
                // Top level file
                const name = parts[0];
                // Skip home, impressum, and privacy as we handle them specifically
                if (!['home', 'impressum', 'privacy'].includes(name.toLowerCase())) {
                    structure.topLevel.push({
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        path: `/wiki/${name}`
                    });
                }
            } else {
                // Nested file
                const folder = parts[0];
                const name = parts[1];

                if (!structure.folders[folder]) {
                    structure.folders[folder] = [];
                }

                structure.folders[folder].push({
                    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
                    path: `/wiki/${folder}/${name}` // This assumes WikiPage handles nested slugs or we change routing
                });
            }
        });

        // Sort top level items
        structure.topLevel.sort((a, b) => a.name.localeCompare(b.name));

        // Sort folders and their contents
        const sortedFolders = Object.entries(structure.folders)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([folder, items]) => ({
                name: folder.charAt(0).toUpperCase() + folder.slice(1),
                items: items.sort((a, b) => a.name.localeCompare(b.name))
            }));

        return {
            topLevel: structure.topLevel,
            folders: sortedFolders
        };
    }, []);

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose} />}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <nav className={styles.nav}>
                    {/* Home Link Always First */}
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.activeLink : ''}`
                        }
                        onClick={onClose}
                    >
                        Home
                    </NavLink>

                    {/* Top Level Links */}
                    {navigation.topLevel.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `${styles.link} ${isActive ? styles.activeLink : ''}`
                            }
                            onClick={onClose}
                        >
                            {link.name}
                        </NavLink>
                    ))}

                    {/* Folders */}
                    {navigation.folders.map((folder) => (
                        <div key={folder.name}>
                            <div className={styles.categoryHeader}>{folder.name}</div>
                            {folder.items.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `${styles.link} ${styles.subLink} ${isActive ? styles.activeLink : ''}`
                                    }
                                    onClick={onClose}
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.footerLinks}>
                        <a href="mailto:support@transientrealm.de" className={styles.footerLink} title="Contact">
                            <Mail size={18} />
                            <span>Kontakt</span>
                        </a>
                        <NavLink to="/wiki/impressum" className={styles.footerLink} title="Impressum">
                            <Shield size={18} />
                            <span>Impressum</span>
                        </NavLink>
                    </div>

                    <div className={styles.socialLinks}>
                        <a href="https://discord.gg/9ccpRrWejj" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Discord">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/@TransientRealmDE" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="YouTube">
                            <Youtube size={18} />
                        </a>
                        <a href="https://github.com/TransientCodes" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="GitHub">
                            <Github size={18} />
                        </a>
                    </div>

                    <div className={styles.copyright}>
                        © 2025 Transient Realm
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
