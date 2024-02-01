const express = require('express');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const EXTRA_EXTERNAL_URL = process.env.EXTRA_EXTERNAL_ACCESS_ORIGIN || null;

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
  if (EXTRA_EXTERNAL_URL) {
    res.setHeader('Access-Control-Allow-Origin', EXTRA_EXTERNAL_URL);
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
