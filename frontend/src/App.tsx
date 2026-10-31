import { Suspense, useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import PageTransitionProvider from './components/PageTransition.tsx';
import { basename, pageRoutes } from './routes.ts';
import './App.css';

/** Vercel Analytics loads after the page is idle so it never competes with the first paint. */
const DeferredAnalytics = () => {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  useEffect(() => {
    const load = () => import('@vercel/analytics/react').then((m) => setComponent(() => m.Analytics as ComponentType));
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
    if (idle) idle(load); else setTimeout(load, 2500);
  }, []);
  return Component ? <Component /> : null;
};

function App() {
  return (
    <Router basename={basename}>
      <DeferredAnalytics />
      <PageTransitionProvider>
        <Suspense fallback={<div style={{ minHeight: '60vh' }} aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {pageRoutes.map(({ path, Page }) =>
                path === '/'
                  ? <Route key={path} index element={<Page />} />
                  : <Route key={path} path={path.slice(1)} element={<Page />} />,
              )}
            </Route>

            {/* Fallback for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </PageTransitionProvider>
    </Router>
  );
}

export default App;
