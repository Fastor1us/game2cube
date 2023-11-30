// services/userService.js
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'elephant-DB',
  port: 5432,
});


const checkUserExists = async (field, value) => {
  const testQuery = `SELECT * FROM game2cube.users
                     WHERE ${field} = '${value}'`;
  const { rows } = await pool.query(testQuery);
  return rows;
};


const getUsers = async () => {
  const testQuery = 'SELECT * FROM game2cube.users';
  const { rows } = await pool.query(testQuery);
  return rows;
};

const checkEmailRegistrationsExist = async (email) => {
  const testQuery = `SELECT * FROM game2cube.registration
                     WHERE email = '${email}'`;
  const { rows } = await pool.query(testQuery);
  return rows;
}


const checkConfirmationCode = async (email, confirmationCode) => {
  const code = Number(confirmationCode);
  const testQuery = `SELECT * FROM game2cube.registration
                     WHERE email = '${email}' AND 
                     confirmation_code = ${code}`;
  const { rows } = await pool.query(testQuery);
  return rows;
}

/**
 * Deletes a registration record from the game2cube.registration table based on the specified email.
 * @param {string} email - The email to match for deletion.
 */
const deleteRegistrationRecord = async (email) => {
  const deleteQuery = {
    text: 'DELETE FROM game2cube.registration WHERE email = $1',
    values: [email],
  };
  return await pool.query(deleteQuery);
}


const createRegistrationRecord
  = async (username, email, password, confirmationCode) => {
    const insertQuery = {
      text: `INSERT INTO 
      game2cube.registration(username, email, password, confirmation_code)
      VALUES($1, $2, $3, $4)`,
      values: [username, email, password, confirmationCode],
    };
    return await pool.query(insertQuery)
  }

const createUsersRecord
  = async (username, email, password, token) => {
    const insertQuery = {
      text: `INSERT INTO 
      game2cube.users(username, email, password, token)
      VALUES($1, $2, $3, $4)`,
      values: [username, email, password, token],
    };
    return await pool.query(insertQuery)
  }

const nodemailer = require('nodemailer');
const sendConfirmationEmail = async (email, confirmationCode) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // secure: true,
    port: 587,
    auth: {
      user: 'fireday6@gmail.com',
      pass: 'jdnl ciaz jlsm ddki',
    },
  });
  const mailOptions = {
    from: 'game2cube <fireday6@gmail.com>',
    to: email,
    subject: 'Подтверждение регистрации',
    text: `Ваш код подтверждения: ${confirmationCode}`,
  };
  return await transporter.sendMail(mailOptions);
};


module.exports = {
  checkUserExists,
  getUsers,
  checkEmailRegistrationsExist,
  checkConfirmationCode,
  createRegistrationRecord,
  deleteRegistrationRecord,
  createUsersRecord,
  sendConfirmationEmail,
};
