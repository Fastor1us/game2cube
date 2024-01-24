const express = require('express');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const serverData = require('../server_data.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  const url = process.env.NODE_ENV === 'prod' ?
    serverData.cors.prod : serverData.cors.dev;
  res.setHeader('Access-Control-Allow-Origin', url);
  res.setHeader('Access-Control-Allow-Headers',
    'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  req.token = req.headers.authorization;
  next();
});

// ==========================================================
// ==================== USER ROUTE ==========================
app.use('/user', userRoutes);
// ==================== GANE ROUTE ==========================
app.use('/game', gameRoutes);
// ==========================================================

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}\n`);
});
