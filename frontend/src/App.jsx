import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import GamePage from './pages/GamePage/GamePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import CreateLevelsPage from './pages/CreateLevelsPage/CreateLevelsPage';
import AboutPage from './pages/AboutPage/AboutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { useDispatch } from 'react-redux';
import { setUserData } from './store/slicers/userSlicer';
import { userAPI } from './utils/api/user-api';
import { OnlyAuth, OnlyUnAuth } from './components/ProtectedRoute.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage.jsx';


export default function App() {
  const dispatch = useDispatch();

  const [authentication, { error, data }] =
    userAPI.useAuthenticationMutation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    token && authentication({ token });
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setUserData({ ...data, isAuth: true }));
      document.cookie = `token=${localStorage.getItem('token')}`;
    }
    error && console.log('Ошибка аутентификации:', error);
    error && localStorage.removeItem('token');
  }, [data, error]);

  const isTouchDevice =
    ('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='/registration' element={
          <OnlyUnAuth component={<RegisterPage />} />}
        />
        <Route path='/login' element={
          <OnlyUnAuth component={<LoginPage />} />}
        />
        <Route path='/forgot-password' element={
          <OnlyUnAuth component={<ForgotPasswordPage />} />}
        />
        <Route path='/profile' element={
          <OnlyAuth component={<ProfilePage />} />}
        />
        <Route path='/game' element={<GamePage />} />
        <Route path='/create-level'
          element={
            <DndProvider
              backend={isTouchDevice ? TouchBackend : HTML5Backend}
            >
              <CreateLevelsPage />
            </DndProvider>
          }
        />
        <Route path='/about' element={<AboutPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
