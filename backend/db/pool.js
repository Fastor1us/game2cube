const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'elephant-DB',
//   port: 5432,
// });

const pool = new Pool({
  user: 'express',
  host: 'localhost',
  database: 'postgres',
  password: 'gfhjkmr<L',
  port: 5432,
});

module.exports = pool;
