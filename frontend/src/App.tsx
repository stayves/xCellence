import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Team from './pages/Team.tsx';
import Events from './pages/Events.tsx';
import Robot from './pages/Robot.tsx';
import Contact from './pages/Contact.tsx';
import Calendar from './pages/Calendar.tsx';
import Resources from './pages/Resources.tsx';
import Blog from './pages/Blog.tsx';
import HallOfFame from './pages/HallOfFame.tsx';
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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="team" element={<Team />} />
          <Route path="events" element={<Events />} />
          <Route path="robot" element={<Robot />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="resources" element={<Resources />} />
          <Route path="blog" element={<Blog />} />
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
