import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from './Layout.module.css';
import Sidebar from './Sidebar.jsx';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle Menu">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={styles.branding}>
          <img src="/logo.png" alt="Transient Wiki Logo" className={styles.logo} />
          <h1 className={styles.title}>Transient Wiki</h1>
        </div>
        <div style={{ width: 24 }}></div>
      </header>

      <div className={styles.main}>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className={styles.content}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
