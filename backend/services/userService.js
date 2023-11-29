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


const checkConfirmationCodeExist = async (confirmationCode) => {
  const code = Number(confirmationCode);
  const testQuery = `SELECT * FROM game2cube.registration
                     WHERE confirmation_code = ${code}`;
  const { rows } = await pool.query(testQuery);
  return rows;
}

/**
 * Deletes a registration record from the game2cube.registration table based on the specified email.
 * @param {string} email - The email to match for deletion.
 */
const deleteRegistrationByEmail = async (email) => {
  const deleteQuery = {
    text: 'DELETE FROM game2cube.registration WHERE email = $1',
    values: [email],
  };
  return await pool.query(deleteQuery);
}


const createRegistrationCode
  = async (username, email, password, confirmationCode) => {
    const insertQuery = {
      text: `INSERT INTO 
      game2cube.registration(username, email, password, confirmation_code)
      VALUES($1, $2, $3, $4)`,
      values: [username, email, password, confirmationCode],
    };
    return await pool.query(insertQuery)
  }


const nodemailer = require('nodemailer');
const sendConfirmationEmail = async (email, confirmationCode) => {
  const transporter = nodemailer.createTransport({
    // pool: true,
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    // port: 587,
    auth: {
      user: 'fewgwer3@yandex.ru',
      pass: 'tpqjotxqkrxoxene',
    },
  });

  const mailOptions = {
    from: 'fewgwer3@yandex.ru',
    to: email,
    subject: 'Подтверждение регистрации',
    text: `Ваш код подтверждения: ${confirmationCode}`,
  };

  return await transporter.sendMail(mailOptions);
};

// return transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log('Error:', error);
//   } else {
//     console.log('Email sent:', info.response);
//   }
// });

// const info = await transporter.sendMail(message)

// if (info.response.substr(0, 3) == '250') {
//   return `Письмо успешно отправлено на адрес ${email}!`
// }

// return `Ошибка отправки письма на адрес ${email}!`


module.exports = {
  checkUserExists,
  getUsers,
  checkEmailRegistrationsExist,
  checkConfirmationCodeExist,
  deleteRegistrationByEmail,
  createRegistrationCode,
  sendConfirmationEmail,
};
