const userService = require('../services/userService');


exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  // после получения данных из формы регистрации пользователя, проверяем:
  try {
    // 1) что email не занят (таблица users)
    const emailExists = await userService.checkUser('email', email);
    if (emailExists.length > 0) {
      // 409 - conflict , 422 - Unprocessable Entity , 424 - Failed Dependency
      res.status(409).json({ error: 'На данную почту уже зарегистрирован аккаунт' });
      return;
    }
    // 2) что имя пользователя не занято (таблица users)
    const usernameExists = await userService.checkUser('username', username);
    if (usernameExists.length > 0) {
      res.status(409).json({ error: 'Данное имя пользователя уже занято' });
      return;
    }
    // 3) проверяем есть ли в таблице registration запись с переданным email
    const emailRegistrationCodeExists = await userService.checkRegistration(email);
    if (emailRegistrationCodeExists.length > 0) {
      // если есть, то удаляем запись
      await userService.deleteRegistration(email);
    }
    // если всё ок, то создаем новую запись
    const confirmationCode = Math.floor(1000 + Math.random() * 9000);
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
  const { username, email, password, confirmationCode } = req.body;
  try {
    // перед проверкой кода подтверждения проверяем, что
    // 1) что email не занят (таблица users)
    const emailExists = await userService.checkUser('email', email);
    if (emailExists.length > 0) {
      res.status(409).json({
        error: 'На указанную почту уже зарегистрирован аккаунт'
      });
      return;
    }
    // 2) что имя пользователя не занято (таблица users)
    const usernameExists = await userService.checkUser('username', username);
    if (usernameExists.length > 0) {
      res.status(409).json({ error: 'Имя пользователя уже занято' });
      return;
    }
    // 3) проверяем совпадает ли переданный код с кодом из таблицы registration
    const emailRegistrationCodeExists =
      await userService.checkCode(email, confirmationCode);
    if (emailRegistrationCodeExists.length > 0) {
      const { nanoid } = require('@reduxjs/toolkit');
      const token = nanoid();
      await userService.deleteRegistration(email);
      await userService.createUser(username, email, password, token);
      res.status(200).json({ username, email, token });
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
    if (user.length > 0) {
      res.status(200).json({
        username: user[0].username,
        email: user[0].email,
        token: user[0].token
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
    if (user.length > 0) {
      res.status(200).json({
        username: user[0].username,
        email: user[0].email
      });
    } else {
      res.status(401).json({ error: 'Неверный токен' });
    }
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
