import { lazy } from 'react';
import type { ComponentType } from 'react';
import { matchPath } from 'react-router-dom';
import Home from './pages/Home.tsx';

/**
 * Single source of truth for the site's pages.
 * App.tsx renders these as <Route>s; the page transition uses the same list to tell app routes
 * from static files and to start downloading a page's chunk on the click that leads to it.
 */

// Everything except the home page is split into its own chunk so the first paint stays small.
const load = {
  team: () => import('./pages/Team.tsx'),
  events: () => import('./pages/Events.tsx'),
  trainer: () => import('./pages/Trainer.tsx'),
  contact: () => import('./pages/Contact.tsx'),
  calendar: () => import('./pages/Calendar.tsx'),
  resources: () => import('./pages/Resources.tsx'),
  blog: () => import('./pages/Blog.tsx'),
  blogArticle: () => import('./pages/BlogArticle.tsx'),
  hallOfFame: () => import('./pages/HallOfFame.tsx'),
  partners: () => import('./pages/Partners.tsx'),
  teams: () => import('./pages/Teams.tsx'),
};

type PageRoute = { path: string; Page: ComponentType; preload?: () => Promise<unknown> };

export const pageRoutes: PageRoute[] = [
  { path: '/', Page: Home },
  { path: '/teams', Page: lazy(() => load.teams().then((m) => ({ default: m.TeamsOverview }))), preload: load.teams },
  { path: '/teams/:slug', Page: lazy(() => load.teams().then((m) => ({ default: m.TeamPage }))), preload: load.teams },
  { path: '/team', Page: lazy(load.team), preload: load.team },
  { path: '/partners', Page: lazy(load.partners), preload: load.partners },
  { path: '/events', Page: lazy(load.events), preload: load.events },
  { path: '/trainer', Page: lazy(load.trainer), preload: load.trainer },
  { path: '/calendar', Page: lazy(load.calendar), preload: load.calendar },
  { path: '/resources', Page: lazy(load.resources), preload: load.resources },
  { path: '/blog', Page: lazy(load.blog), preload: load.blog },
  { path: '/blog/:slug', Page: lazy(load.blogArticle), preload: load.blogArticle },
  { path: '/hall-of-fame', Page: lazy(load.hallOfFame), preload: load.hallOfFame },
  { path: '/contact', Page: lazy(load.contact), preload: load.contact },
];

const normalizeBase = (rawBase: string | undefined) => {
  if (!rawBase || rawBase === '/') {
    return undefined;
  }

  return rawBase.replace(/\/+$/, '');
};

export const basename = normalizeBase(import.meta.env.BASE_URL);

const routeFor = (pathname: string) => pageRoutes.find((r) => matchPath({ path: r.path, end: true }, pathname));

export const isPageRoute = (pathname: string) => Boolean(routeFor(pathname));

/** Starts loading the page's chunk. Resolves at once for eager pages; rejects if the chunk fails to load. */
export const preloadRoute = (pathname: string): Promise<unknown> => routeFor(pathname)?.preload?.() ?? Promise.resolve();
