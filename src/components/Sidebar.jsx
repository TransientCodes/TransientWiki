import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Book,
  Building2,
  ChevronDown,
  Compass,
  Flame,
  Github,
  Lock,
  Mail,
  Pickaxe,
  Shield,
  Trophy,
  Users,
  Youtube,
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { getNavigationStructure } from '../content/contentIndex';

// Kategorie-Icons: gebündelte lucide-Icons (self-hosted, kein Iconify-API-Request)
const CATEGORY_ICONS = {
  building: Building2,
  compass: Compass,
  flame: Flame,
  pickaxe: Pickaxe,
  trophy: Trophy,
  users: Users,
};

const Sidebar = ({ isOpen, onClose }) => {
  const [openFolders, setOpenFolders] = useState({});
  const isFolderOpen = (name) => openFolders[name] !== false;
  const toggleFolder = (name) =>
    setOpenFolders((prev) => ({ ...prev, [name]: !isFolderOpen(name) }));

  const navigation = useMemo(() => getNavigationStructure(), []);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}
            onClick={onClose}
          >
            Startseite
          </NavLink>

          {navigation.topLevel.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}
              onClick={onClose}
            >
              {link.name}
            </NavLink>
          ))}

          {navigation.folders.map((folder) => {
            const CategoryIcon = CATEGORY_ICONS[folder.icon];
            return (
            <div key={folder.name}>
              <button
                className={styles.categoryHeader}
                onClick={() => toggleFolder(folder.name)}
                aria-expanded={isFolderOpen(folder.name)}
              >
                {CategoryIcon && <CategoryIcon size={13} className={styles.categoryIcon} />}
                {folder.name}
                <ChevronDown
                  size={12}
                  className={`${styles.chevron} ${!isFolderOpen(folder.name) ? styles.chevronClosed : ''}`}
                />
              </button>
              <div
                className={`${styles.folderItems} ${!isFolderOpen(folder.name) ? styles.folderItemsClosed : ''}`}
              >
                <div className={styles.folderItemsInner}>
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
              </div>
            </div>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.footerLinks}>
            <a href="mailto:business@transientcodes.de" className={styles.footerLink} title="Kontakt">
              <Mail size={18} />
              <span>Kontakt</span>
            </a>
            <NavLink to="/wiki/impressum" className={styles.footerLink} title="Impressum">
              <Shield size={18} />
              <span>Impressum</span>
            </NavLink>
            <NavLink to="/wiki/regelwerk" className={styles.footerLink} title="Regelwerk">
              <Book size={18} />
              <span>Regelwerk</span>
            </NavLink>
            <NavLink to="/wiki/privacy" className={styles.footerLink} title="Datenschutz">
              <Lock size={18} />
              <span>Datenschutz</span>
            </NavLink>
          </div>

          <div className={styles.socialLinks}>
            <a
              href="https://discord.gg/9ccpRrWejj"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              title="Discord"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@TransientRealmDE"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              title="YouTube"
            >
              <Youtube size={18} />
            </a>
            <a
              href="https://github.com/TransientCodes"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              title="GitHub"
            >
              <Github size={18} />
            </a>
          </div>

          <div className={styles.copyright}>© 2026 Transient Realm</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
