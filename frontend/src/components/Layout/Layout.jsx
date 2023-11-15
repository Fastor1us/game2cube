import React from 'react';
import { Outlet } from 'react-router-dom';


export default function Layout() {
  return (
    <>
      <header>
        тут будет шапка
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        тут будет футер
      </footer>
    </>
  );
}
