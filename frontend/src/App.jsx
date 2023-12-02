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
import { OnlyAuth, OnlyUnAuth } from './components/ProtectedRoute';


export default function App() {
  const dispatch = useDispatch();

  const [authentication, { error, data }] =
    userAPI.useAuthenticationMutation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    token && authentication({ token });
  }, []);

  useEffect(() => {
    data && dispatch(setUserData({ ...data, isAuth: true }));
    error && console.log('Ошибка аутентификации:', error);
  }, [data, error]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* <Route index element={<GamePage />} /> */}
        <Route index element={<HomePage />} />
        <Route path='/registration' element={
          <OnlyUnAuth component={<RegisterPage />} />}
        />
        <Route path='/login' element={
          <OnlyUnAuth component={<LoginPage />} />}
        />
        <Route path='/profile' element={
          <OnlyAuth component={<ProfilePage />} />}
        />
        <Route path='/game' element={<GamePage />} />
        <Route path='/create-level' element={<CreateLevelsPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
