import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
// import HomePage from './pages/home-page/home-page';
import GamePage from './pages/GamePage/GamePage';
import CreateLevelPage from './pages/CreateLevelPage/CreateLevelPage';
import AboutPage from './pages/AboutPage/AboutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';


export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* <Route index element={<HomePage />} /> */}
        {/* <Route index element={<GamePage />} /> */}
        <Route index element={<GamePage />} />
        <Route path='/create-level' element={<CreateLevelPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
