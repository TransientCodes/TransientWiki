import React from 'react';
import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import WikiPage from './pages/WikiPage';

function App({ location = null }) {
  const Router = location ? MemoryRouter : BrowserRouter;
  const routerProps = location ? { initialEntries: [location] } : {};

  return (
    <Router {...routerProps}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WikiPage />} />
          <Route path="wiki/*" element={<WikiPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
