const userService = require('../services/userService');


exports.getUser = (req, res) => {
  res.status(200).json('ответ на GET запрос по URL /user');
};

exports.getUsers = async (req, res) => {
  try {
    const rows = await userService.getUsers();
    res.json(rows);
  } catch (error) {
    console.error('Ошибка при получении данных о пользователях:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  // после получения данных из формы регистрации пользователя, проверяем:
  try {
    // 1) что email не занят (таблица users)
    const emailExists = await userService.checkUserExists('email', email);
    if (Object.keys(emailExists).length > 0) {
      // 409 - conflict , 422 - Unprocessable Entity , 424 - Failed Dependency
      res.status(409).json({ error: 'На данную почту уже зарегистрирован аккаунт' });
      return;
    }
    // 2) что имя пользователя не занято (таблица users)
    const usernameExists = await userService.checkUserExists('username', username);
    if (Object.keys(usernameExists).length > 0) {
      res.status(409).json({ error: 'Имя пользователя уже занято' });
      return;
    }
    // 3) если в таблице registration есть запись с таким email, то удаляем её
    const emailRegistrationCodeExists = await userService.checkEmailRegistrationsExist(email);
    if (Object.keys(emailRegistrationCodeExists).length > 0) {
      // удаляем запись с таким email из таблицы registration
      const res = await userService.deleteRegistrationByEmail(email);
    }
    // если всё ок, то создаем запись в таблицу registration
    const confirmationCode = Math.floor(1000 + Math.random() * 9000);

    await userService.createRegistrationCode(username, email, password, confirmationCode);

    // после записи отправляем письмо на указанную почту с кодом подтвержения

    // TODO
    // await userService.sendConfirmationEmail(email, confirmationCode);

    // если всё прошло успешно, то отправлаяем ответ клиенту с уведомлением отправки кода на почту
    res.status(200).json('Успешно. Ответ на POST запрос по URL user/register');
  } catch (error) {
    console.error('Ошибка при получении данных о пользователях:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
};

exports.registrationConfirm = async (req, res) => {
  const { username, email, confirmationCode } = req.body;
  try {
    // перед проверкой кода подтверждения проверяем, что
    // 1) что email не занят (таблица users)
    const emailExists = await userService.checkUserExists('email', email);
    if (Object.keys(emailExists).length > 0) {
      res.status(409).json({ error: 'На данную почту уже зарегистрирован аккаунт' });
      return;
    }
    // 2) что имя пользователя не занято (таблица users)
    const usernameExists = await userService.checkUserExists('username', username);
    if (Object.keys(usernameExists).length > 0) {
      res.status(409).json({ error: 'Имя пользователя уже занято' });
      return;
    }
    // 3) проверяем совпадает ли переданный код подтверждения с кодом из таблицы registration
    console.log('confirmationCode:', confirmationCode);
    const emailRegistrationCodeExists =
      await userService.checkConfirmationCodeExist(confirmationCode);
    if (Object.keys(emailRegistrationCodeExists).length > 0) {
      console.log(emailRegistrationCodeExists);
    }
    res.json(emailRegistrationCodeExists);
    // res.status(200).json('Успешно. Ответ на POST запрос по URL user/registrationConfirm');
  } catch (error) {
    console.error('Ошибка при получении данных о пользователях:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
