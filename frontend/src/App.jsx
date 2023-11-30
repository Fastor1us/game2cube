import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
// import HomePage from './pages/home-page/home-page';
import GamePage from './pages/GamePage/GamePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import CreateLevelPage from './pages/CreateLevelPage/CreateLevelPage';
import AboutPage from './pages/AboutPage/AboutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { useDispatch } from 'react-redux';
import { setUserData } from './store/slicers/userSlicer';
import { userAPI } from './utils/api/user-api';


export default function App() {
  const dispatch = useDispatch();

  const [authentication, { error, data }] =
    userAPI.useAuthenticationMutation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO
      // стучимся на сервер, отправляем токен, получаем ответ
      authentication({ token });
      // 200 - имя и почту, или ошибку
      // если 200, диспатчим имя, почту и auth=true в redux.user
    }
  }, []);

  useEffect(() => {
    data && dispatch(setUserData({ ...data, auth: true }));
    error && console.log('Ошибка аутентификации:', error);
  }, [data, error]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* <Route index element={<HomePage />} /> */}
        <Route index element={<GamePage />} />
        <Route path='/registration' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/create-level' element={<CreateLevelPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
