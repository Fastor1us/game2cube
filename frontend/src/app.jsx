import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
// import HomePage from './pages/home-page/home-page';
import GamePage from './pages/game-page/game-page';
import AboutPage from './pages/about-page/about-page';
import NotFoundPage from './pages/not-found-page/not-found-page';


export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* <Route index element={<HomePage />} /> */}
        <Route index element={<GamePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
