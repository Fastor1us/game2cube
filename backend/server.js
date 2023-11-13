// import pkg from 'pg';
import express from 'express';
import serverData from '../server_data.js';

// import fs from 'fs';

// const serverDataPath = './server_data.json';
// const serverData = JSON.parse(fs.readFileSync(serverDataPath, 'utf8'));

const port = 3001;

// const serverData = 'dev';

// const { Pool } = pkg;
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

app.get('/users', (req, res) => {
  res.status(200).json('ответ на GET запрос по URL /users');
});

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'elephant-DB',
//   port: 5432,
// });

// app.get('/users', async (req, res) => {
//   try {
//     const usersQuery = 'SELECT * FROM game10cube.users';
//     const { rows: users } = await pool.query(usersQuery);

//     res.json(users);
//   } catch (error) {
//     console.error('Ошибка при получении данных о пользователях:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!\n`);
});
