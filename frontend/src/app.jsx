import React from 'react';
import axios from 'axios';

import serverData from '../../server_data.js';


export default function App() {
  const [res, setRes] = React.useState('none');

  const handleButtonClick = () => {
    axios
      .get(`${serverData.url}/users`)
      .then(res => {
        setRes(res.data);
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
