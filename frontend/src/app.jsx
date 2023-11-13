import React from 'react';

// const URL = 'http://localhost:3001/';
const URL = 'https://game2cube-server.onrender.com';


export default function App() {
  const [res, setRes] = React.useState('none');

  const handleButtonClick = () => {
    fetch(`${URL}/users`)
      .then(response => response.json())
      .then(data => {
        setRes(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (<>
    <h1>React 18</h1>

    <button onClick={handleButtonClick}>
      нажми на меня
    </button>
    <p>
      {res}
    </p>
  </>
  );
}
