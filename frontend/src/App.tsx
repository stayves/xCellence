import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Team from './pages/Team.tsx';
import Events from './pages/Events.tsx';
import Trainer from './pages/Trainer.tsx';
import Contact from './pages/Contact.tsx';
import Calendar from './pages/Calendar.tsx';
import Resources from './pages/Resources.tsx';
import Blog from './pages/Blog.tsx';
import BlogArticle from './pages/BlogArticle.tsx';
import HallOfFame from './pages/HallOfFame.tsx';
import { Analytics } from "@vercel/analytics/next"
import './App.css';

const normalizeBase = (rawBase: string | undefined) => {
  if (!rawBase || rawBase === '/') {
    return undefined;
  }

  return rawBase.replace(/\/+$/, '');
};

const basename = normalizeBase(import.meta.env.BASE_URL);

function App() {
  return (
    <Router basename={basename}>
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="team" element={<Team />} />
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
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
