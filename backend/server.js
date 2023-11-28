// import pkg from 'pg';
const express = require('express');
const serverData = require('../server_data.js');

const port = 3001;

const app = express();

app.use((req, res, next) => {
  const url = process.env.NODE_ENV === 'prod' ?
    serverData.cors.prod : serverData.cors.dev;
  res.setHeader('Access-Control-Allow-Origin', url);
  next();
});

app.use(
  express.json(),
);

app.get('/register', (req, res) => {
  // res.status(200).json('ответ на GET запрос по URL /register');
  res.status(200).json(`req.body: ${JSON.stringify(req.body)}`);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!\n`);
});
