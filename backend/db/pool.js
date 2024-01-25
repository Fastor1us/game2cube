const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.POSTGRE_USER || 'express',
  host: process.env.POSTGRE_HOST || 'localhost',
  database: process.env.POSTGRE_DATABASE || 'postgres',
  password: process.env.POSTGRE_PASSWORD || 'gfhjkmr<L',
  port: 5432,
});

module.exports = pool;
