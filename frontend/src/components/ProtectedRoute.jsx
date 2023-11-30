import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';


const Protected = ({ onlyUnAuth = false, component }) => {
  const location = useLocation();
  // TODO
  // после localStorage.getItem('token') проверяем стоит ли флаг true
  // в сторе redux.user.auth , если да, то isAuth = true
  const isAuth = localStorage.getItem('token');

  if (onlyUnAuth && isAuth) {
    const { from } = location.state || { from: { pathname: "/" } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return component;
}


export const OnlyAuth = Protected;

export const OnlyUnAuth = ({ component }) => (
  <Protected onlyUnAuth={true} component={component} />
);
