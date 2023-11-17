import React from 'react';
import axios from 'axios';

import serverData from '../../../../server_data.js';

import Henry from '../../image/Henry.jpg';


export default function HomePage() {
  const [res, setRes] = React.useState('none');

  const handleButtonClick = () => {
    axios
      .get(`${serverData.url}/users`)
      .then(res => {
        setRes(res.data);
      })
      .catch(error => {
        setRes('error occured');
        console.error('Error:', error);
      });
  };

  return (
    <>
      <h1>React 18</h1>
      <img src={Henry} alt='Henry' />
      <br />
      <button onClick={handleButtonClick}>
        нажми на меня
      </button>
      <p>
        {res}
      </p>
    </>
  );
}
