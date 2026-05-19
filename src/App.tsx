import { Routes, Route } from 'react-router';

import MainLayout from './layout/MainLayout/MainLayout';

import HomePage from './pages/HomePage/HomePage';
import CharacterDetailsPage from './pages/CharacterDetailsPage/CharacterDetailsPage';
import AboutPage from './pages/AboutPage/AboutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<HomePage />}>
          <Route path="character/:id" element={<CharacterDetailsPage />} />
        </Route>

        <Route path="about" element={<AboutPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
