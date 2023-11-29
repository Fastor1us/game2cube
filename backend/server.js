const express = require('express');
const userRoutes = require('./routes/userRoutes');
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

// ==========================================================
// ==================== USER ROUTES =========================
app.use('/user', userRoutes);
// ==========================================================

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!\n`);
});
