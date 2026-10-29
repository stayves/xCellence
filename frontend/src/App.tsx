import { lazy, Suspense, useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import './App.css';

// Everything except the home page is split into its own chunk so the first paint stays small.
const Team = lazy(() => import('./pages/Team.tsx'));
const Events = lazy(() => import('./pages/Events.tsx'));
const Trainer = lazy(() => import('./pages/Trainer.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const Calendar = lazy(() => import('./pages/Calendar.tsx'));
const Resources = lazy(() => import('./pages/Resources.tsx'));
const Blog = lazy(() => import('./pages/Blog.tsx'));
const BlogArticle = lazy(() => import('./pages/BlogArticle.tsx'));
const HallOfFame = lazy(() => import('./pages/HallOfFame.tsx'));
const Partners = lazy(() => import('./pages/Partners.tsx'));
const TeamsOverview = lazy(() => import('./pages/Teams.tsx').then((m) => ({ default: m.TeamsOverview })));
const TeamPage = lazy(() => import('./pages/Teams.tsx').then((m) => ({ default: m.TeamPage })));

const normalizeBase = (rawBase: string | undefined) => {
  if (!rawBase || rawBase === '/') {
    return undefined;
  }

  return rawBase.replace(/\/+$/, '');
};

const basename = normalizeBase(import.meta.env.BASE_URL);

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
      <Suspense fallback={<div style={{ minHeight: '60vh' }} aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="teams" element={<TeamsOverview />} />
            <Route path="teams/:slug" element={<TeamPage />} />
            <Route path="team" element={<Team />} />
            <Route path="partners" element={<Partners />} />
            <Route path="events" element={<Events />} />
            <Route path="trainer" element={<Trainer />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="resources" element={<Resources />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogArticle />} />
            <Route path="hall-of-fame" element={<HallOfFame />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Fallback for any unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
