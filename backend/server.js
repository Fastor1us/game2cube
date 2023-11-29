const { Pool } = require('pg');
const express = require('express');
const serverData = require('../server_data.js');

const port = 3001;

const app = express();

app.use((req, res, next) => {
  const url = process.env.NODE_ENV === 'prod' ?
    serverData.cors.prod : serverData.cors.dev;
  res.setHeader('Access-Control-Allow-Origin', url);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(
  express.json(),
);

app.get('/user', (req, res) => {
  res.status(200).json('ответ на GET запрос по URL /user');
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'elephant-DB',
  port: 5432,
});


app.get('/users', async (req, res) => {
  try {
    const testQuery = 'SELECT * FROM game2cube.users';
    const { rows } = await pool.query(testQuery);
    // res.json(rows) = res.status(200).json(rows);
    res.json(rows);
  } catch (error) {
    console.error('Ошибка при получении данных о пользователях:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const checkUserExists = async (field, value) => {
  const testQuery = `SELECT * FROM game2cube.users
                     WHERE ${field} = '${value}'`;
  const { rows } = await pool.query(testQuery);
  return rows;
}

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  // после получения данных из формы регистрации пользователя, проверяем:
  try {
    // 1) что email не занят (таблица users)
    const emailExists = await checkUserExists('email', email);
    if (Object.keys(emailExists).length > 0) {
      // какой код возвращать?
      // 409 - conflict
      // 422 - Unprocessable Entity обычно используется, когда сервер понимает запрос,
      // но не может обработать его из-за некорректных или несоответствующих данных
      // 424 - Failed Dependency
      res.status(409).json({ error: 'На данную почту уже зарегистрирован аккаунт' });
      // почта: rows[0].email
    }
    // 2) что имя пользователя не занято (таблица users)
    const usernameExists = await checkUserExists('email', email);
    if (Object.keys(usernameExists).length > 0) {
      res.status(409).json({ error: 'Имя пользователя занято' });
    }

  } catch (error) {
    console.error('Ошибка при получении данных о пользователях:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
  // 3) если в таблице registration есть запись с таким email, то удаляем её
  // если всё ок, то создаем запись в таблицу registration

  // const confirmationCode = Math.floor(1000 + Math.random() * 9000);
  // const insertQuery = {
  //   text: 'INSERT INTO game2cube.registration(username, email, password, confirmation_code) VALUES($1, $2, $3, $4)',
  //   values: [username, email, password, confirmationCode],
  // };

  // после записи отправляем письмо на указанную почту с кодом подтвержения

  // если всё прошло успешно, то отправлаяем ответ клиенту с уведомлением отправки кода на почту

  // pool.query(insertQuery)
  //   .then(() => {
  //     // тут будет ответ серверу
  //     res.status(200).json('Ответ на POST запрос по URL /register');
  //   })
  //   .catch((error) => {
  //     console.error('Ошибка при добавлении записи в таблицу registration:', error);
  //     res.status(500).json({ error: 'Ошибка сервера' });
  //   });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!\n`);
});
