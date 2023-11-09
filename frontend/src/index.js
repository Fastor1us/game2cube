// function component() {
//   const element = document.createElement('div');

//   element.innerHTML = '<h1>Hello World!</h1>';

//   return element;
// }

// document.body.appendChild(component());


import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app.jsx';

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(<App />);
