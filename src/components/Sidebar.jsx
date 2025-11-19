import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
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
                // Skip home as we'll add it manually or handle it specifically
                if (name !== 'home') {
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
            </aside>
        </>
    );
};

export default Sidebar;
