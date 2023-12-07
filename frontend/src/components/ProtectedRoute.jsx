import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { isAuthSelector } from '../store/selectors/userSelectors';


const Protected = ({ onlyUnAuth = false, component }) => {
  const location = useLocation();
  const isAuth = useSelector(isAuthSelector);

  if (!isAuth && localStorage.getItem('token')) { return; }

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
