import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import Exams from './pages/Exams';
import Questions from './pages/Questions';
import Profiles from './pages/Profiles';
import Settings from './pages/Settings';
import { ProfileProvider } from './context/ProfileContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <ProfileProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="questions" element={<Questions />} />
              <Route path="exams" element={<Exams />} />
              <Route path="flashcards" element={<Flashcards />} />
              <Route path="profiles" element={<Profiles />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ProfileProvider>
    </SettingsProvider>
  );
}

export default App;
