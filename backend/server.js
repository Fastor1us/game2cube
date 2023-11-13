// import pkg from 'pg';
import express from 'express';

const port = 3001;


// const { Pool } = pkg;
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

app.use(
  express.json(),
);


app.get('/users', (req, res) => {
  console.log('работает');
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
