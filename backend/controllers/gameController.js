const gameService = require('../services/gameService');
const userService = require('../services/userService');


exports.add = async (req, res) => {
  const { token, data } = req.body;
  try {
    // получаем пользователя по токену
    const user = await userService.getUser(token);
    const levels = await gameService.getUserLevels(user[0].username, token);
    if (levels.length === 10) {
      res.status(409).json({
        error: 'Привышен допустимый лимит кол-ва уровней для пользователя'
      });
      return;
    }
    // делаем запись об уровне в levels
    const id = await gameService.createLevel(token, data.size);
    // делаем запись игровых ячеек в cells
    await gameService.createCells(id, data.cells);
    // все прошло успешно - возвращаем 200
    res.status(200).json({ token, data });
  } catch (error) {
    console.error('Ошибка при создании записи уровня:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
}

exports.delete = async (req, res) => {
  const { token, levelId } = req.body;
  try {
    await gameService.deleteLevel(token, levelId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении уровня:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
}

exports.get = async (req, res) => {
  const { user, size, main, random } = req.query;
  try {
    if (main) {
      const levels = await gameService.getUserLevels('admin', req.token);
      res.json({ levels });
      return;
    }
    if (random) {
      const levels = await gameService.getRandomLevels(req.token);
      res.json({ levels });
      return;
    }
    if (user) {
      const levels = await gameService.getUserLevels(user, req.token);
      res.json({ levels });
      return;
    }
  } catch (error) {
    console.error('Ошибка при получении уровней:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
  res.status(500).json({ error: 'Ошибка сервера' });
}


exports.toggleLike = async (req, res) => {
  const { levelId } = req.body;
  try {
    await gameService.isAbleToLike(req.token, levelId) ?
      await gameService.addLike(req.token, levelId) :
      await gameService.removeLike(req.token, levelId);
    res.status(200).json({ success: true });
    return;
  } catch (error) {
    console.error('Ошибка при лайке:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
}


exports.removeLike = async (req, res) => {
  const { token, levelId } = req.body;
  try {
    await gameService.removeLike(token, levelId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении лайка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
}
