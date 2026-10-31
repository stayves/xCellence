import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export type PageTransitionApi = {
  /** Navigate to an in-app path behind the branded overlay. `label` is the destination name shown and announced. */
  navigate: (to: string, label?: string) => void;
};

export const PageTransitionContext = createContext<PageTransitionApi | null>(null);

/** Transition-aware navigation for code paths that are not <a> links. Falls back to a plain navigate outside the provider. */
export const usePageTransition = (): PageTransitionApi => {
  const ctx = useContext(PageTransitionContext);
  const navigate = useNavigate();
  return ctx ?? { navigate: (to) => navigate(to) };
};
