const userService = require('../services/userService');
const path = require('path');


exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  // после получения данных из формы регистрации пользователя, проверяем:
  try {
    // 1) что email не занят (таблица users)
    const emailExists = await userService.readUser('email', email);
    if (emailExists[0]?.id) {
      // 409 - conflict , 422 - Unprocessable Entity , 424 - Failed Dependency
      res.status(409).json({ error: 'На данную почту уже зарегистрирован аккаунт' });
      return;
    }
    // 2) что имя пользователя не занято (таблица users)
    const usernameExists = await userService.readUser('username', username);
    if (usernameExists[0]?.id) {
      res.status(409).json({ error: 'Данное имя пользователя уже занято' });
      return;
    }
    // 3) проверяем есть ли в таблице registration запись с переданным email
    const emailRegistrationCodeExists = await userService.readRegistration(email);
    if (emailRegistrationCodeExists.length > 0) {
      // если есть, то удаляем запись
      await userService.deleteRegistration(email);
    }
    // если всё ок, то создаем новую запись
    const confirmationCode = userService.generateCode();
    await userService.createRegistration(username, email, password, confirmationCode);
    // после записи отправляем письмо на указанную почту с кодом подтвержения
    await userService.sendConfirmationEmail(email, confirmationCode);
    // если всё прошло успешно, то отправлаяем ответ клиенту с уведомлением отправки кода на почту
    res.status(200).json('Успешно. POST - user/register');
  } catch (error) {
    console.error('Ошибка при получении данных о пользователях:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
};


exports.registrationConfirm = async (req, res) => {
  const { username, email, password, confirmationCode, avatar } = req.body;
  try {
    // перед проверкой кода подтверждения проверяем, что
    // 1) что email не занят (таблица users)
    const emailExists = await userService.readUser('email', email);
    if (emailExists[0]?.id) {
      res.status(409).json({
        error: 'На данную почту уже зарегистрирован аккаунт'
      });
      return;
    }
    // 2) что имя пользователя не занято (таблица users)
    const usernameExists = await userService.readUser('username', username);
    if (usernameExists[0]?.id) {
      res.status(409).json({ error: 'Данное имя пользователя уже занято' });
      return;
    }
    // 3) проверяем совпадает ли переданный код с кодом из таблицы registration
    const emailRegistrationCodeExists =
      await userService.readRegistrationCode(email, confirmationCode);
    if (emailRegistrationCodeExists.length > 0) {
      const { nanoid } = require('@reduxjs/toolkit');
      const token = nanoid();
      await userService.deleteRegistration(email);
      const currDate = new Date();
      await userService.createUser(
        username, email, password, token, avatar, currDate, currDate
      );
      res.status(200).json({ username, email, token, avatar });
    } else {
      // возвращаем сообщение о том, что код не подходит
      res.status(409).json({ error: 'Неверный код подтверждения' });
      return;
    }
  } catch (error) {
    console.error('Ошибка при получении данных о пользователях:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUser(email, password);
    if (user[0]?.id) {
      await userService.updateUser(user[0].token, null, null, null, new Date());
      res.status(200).json({
        username: user[0].username,
        email: user[0].email,
        token: user[0].token,
        avatar: user[0].avatar
      });
    } else {
      res.status(401).json({ error: 'Неверное почта или пароль' });
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}


exports.authentication = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await userService.getUser(token);
    if (user[0]?.id) {
      await userService.updateUser(token, null, null, null, new Date());
      res.status(200).json({
        username: user[0].username,
        email: user[0].email,
        avatar: user[0].avatar
      });
    } else {
      res.status(401).json({ error: 'Неверный токен' });
    }
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}


exports.change = async (req, res) => {
  const { token, username, password, avatar } = req.body;
  try {
    // вызывая процедуру передаём null для неопределённых параметров
    // - необходима передача null вместо udnefined 
    await userService.updateUser(
      token, username || null, password || null, avatar || null, null);
    res.status(200).json({
      ...(username && { username }),
      ...(avatar && { avatar }),
      success: true,
    });
  } catch (error) {
    console.error('Ошибка изменения данных:', error);
    res.status(409).json({ error: 'Данное имя пользователя уже занято' });
  }
};


exports.delete = async (req, res) => {
  const { token } = req.body;
  try {
    await userService.deleteUser(token);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}


exports.recoveryEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const userExist = await userService.readUser('email', email);
    if (!userExist[0]?.email) {
      res.status(409).json({
        error: 'Пользователь с такой почтой не существует'
      });
      return;
    }
    const recoveryExists = await userService.readRecovery(email);
    if (recoveryExists[0].id) {
      await userService.deleteRecovery(email);
    }
    const recoveryCode = userService.generateCode();
    await userService.createRecovery(email, recoveryCode);
    await userService.sendRecoveryEmail(email, recoveryCode);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка восстановления пароля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}


exports.recoveryCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const response = await userService.readRecovery(email);
    console.log('response', response);
    if (response[0].id !== null && response.length > 0) {
      console.log('attempt', response[0].attempt);
      if (Number(code) == response[0].code) {
        const userData = await userService.readUser('email', email);
        await userService.deleteRecovery(email);
        res.status(200).json({ token: userData[0].token });
      } else {
        // проверить .если attempt = 2, то
        if (response[0].attempt === 2) {
          await userService.deleteRecovery(email);
          res.status(409).json({
            error: 'Превышен лимит попыток. Попробуйте позже'
          });
          return;
        } else {
          // если attempt < 2, то увеличить attempt на 1
          await userService.updateRecovery(email, response[0].attempt + 1);
        }
        res.status(409).json({ error: 'Неверный код восстановления' });
      }
    } else {
      res.status(409).json({ error: 'Ошибка восстановления пароля' });
    }
  } catch (error) {
    console.error('Ошибка восстановления пароля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}


exports.getAvatars = async (req, res) => {
  try {
    const avatars = userService.getAvatars();
    res.status(200).json(avatars);
  } catch (error) {
    console.error('Ошибка получения аватаров:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}


exports.getAvatar = async (req, res) => {
  const { filename } = req.params;
  try {
    const imagePath = path.join(__dirname,
      '../public/uploads/avatars', filename);
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Ошибка получения аватара:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
