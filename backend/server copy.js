// import pkg from 'pg';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../webpack.dev.cjs';

// const { Pool } = pkg;
const app = express();
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }),
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

// Serve the files on port 3000.
app.listen(3000, () => {
  console.log('Example app listening on port 3000!\n');
});
