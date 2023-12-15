// services/userService.js
const pool = require('../db/pool');
const fs = require('fs');
const path = require('path');


// const checkUserExists = async (field, value) => {
//   const testQuery = `SELECT * FROM game2cube.users
//                      WHERE ${field} = '${value}'`;
//   const { rows } = await pool.query(testQuery);
//   return rows;
// };
const checkUser = async (field, value) => {
  const { rows } = await pool.query(
    'SELECT game2cube.check_user($1, $2)', [field, value]);
  return rows;
};

// const getUserRecordByEmailAndPass = async (email, password) => {
//   const testQuery = `SELECT * FROM game2cube.users
//                      WHERE email = '${email}' AND 
//                      password = '${password}'`;
//   const { rows } = await pool.query(testQuery);
//   return rows;
// };
// const getUserRecordByToken = async (token) => {
//   const testQuery = `SELECT * FROM game2cube.users
//                      WHERE token = '${token}'`;
//   const { rows } = await pool.query(testQuery);
//   return rows;
// };
// вариант с двумя запросами зависящий от кол-ва аргументов
// const getUser = async (...args) => {
//   if (args.length > 1) {
//     const { rows } = await pool.query(
//       `SELECT game2cube.get_user('${args[0]}', '${args[1]}');`
//     );
//     return rows;
//   } else {
//     const { rows } = await pool.query(
//       `SELECT game2cube.get_user('${args[0]}');`
//     );
//     return rows;
//   }
// };
// использую динамикое формирование запроса
const getUser = async (...args) => {
  const query = {
    text: `SELECT * FROM game2cube.get_user(
      ${args.map((_, index) => `$${index + 1}`).join(', ')});`,
    values: args
  };
  const { rows } = await pool.query(query);
  return rows;
};

const changeUser = async (token, username, password) => {
  await pool.query(
    'CALL game2cube.change_user($1, $2, $3)',
    [token, username, password]);
}

const deleteUser = async (token) => {
  console.log('deleteUser', token);
  // не работает
  return await pool.query('CALL game2cube.delete_user($1)', [token]);
  // работает
  // await pool.query(`CALL game2cube.delete_user('U468rEdLdoSVLRjIBh4Pq')`);
}

// const checkEmailRegistrationsExist = async (email) => {
//   const testQuery = `SELECT * FROM game2cube.registration
//                      WHERE email = '${email}'`;
//   const { rows } = await pool.query(testQuery);
//   return rows;
// }
const checkRegistration = async (email) => {
  const { rows } = await pool.query(
    'SELECT game2cube.check_registration($1)', [email]);
  return rows;
}

// const checkConfirmationCode = async (email, code) => {
//   const testQuery = `SELECT * FROM game2cube.registration
//                      WHERE email = '${email}' AND 
//                      code = ${Number(code)}`;
//   const { rows } = await pool.query(testQuery);
//   return rows;
// }
const checkCode = async (email, code) => {
  const { rows } = await pool.query(
    'SELECT game2cube.check_code($1, $2)', [email, code]);
  return rows;
}

// 
// const deleteRegistrationRecord = async (email) => {
//   const deleteQuery = {
//     text: 'DELETE FROM game2cube.registration WHERE email = $1',
//     values: [email],
//   };
//   return await pool.query(deleteQuery);
// }
const deleteRegistration = async (email) => {
  return await pool.query(
    'CALL game2cube.delete_registration($1)', [email]);
}

// const createRegistrationRecord
//   = async (username, email, password, confirmationCode) => {
//     const insertQuery = {
//       text: `INSERT INTO 
//       game2cube.registration(username, email, password, confirmation_code)
//       VALUES($1, $2, $3, $4)`,
//       values: [username, email, password, confirmationCode],
//     };
//     return await pool.query(insertQuery)
//   }
const createRegistration = async (username, email, password, code) => {
  return await pool.query(
    'CALL game2cube.create_registration($1, $2, $3, $4)',
    [username, email, password, code]);
};

// const createUsersRecord
//   = async (username, email, password, token) => {
//     const insertQuery = {
//       text: `INSERT INTO 
//       game2cube.users(username, email, password, token)
//       VALUES($1, $2, $3, $4)`,
//       values: [username, email, password, token],
//     };
//     return await pool.query(insertQuery)
//   }
const createUser = async (username, email, password, token) => {
  return await pool.query(
    'CALL game2cube.create_user($1, $2, $3, $4)',
    [username, email, password, token]);
};

// ================= отправка письма с кодом на почту =================
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

const getAvatars = () => {
  const avatarsDir = path.join(__dirname, '../public/uploads/avatars');
  const files = fs.readdirSync(avatarsDir);
  return files.map(file => {
    // console.log('file', file);
    return file;
  });
};

module.exports = {
  checkUser,
  getUser,
  changeUser,
  deleteUser,
  checkRegistration,
  checkCode,
  createRegistration,
  deleteRegistration,
  createUser,
  sendConfirmationEmail,
  getAvatars,
};
