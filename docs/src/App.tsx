import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Team from './pages/Team';
import Events from './pages/Events';
import Robot from './pages/Robot';
import Contact from './pages/Contact';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='team' element={<Team />} />
          <Route path='events' element={<Events />} />
          <Route path='robot' element={<Robot />} />
          <Route path='contact' element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
