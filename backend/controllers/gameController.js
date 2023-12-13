const gameService = require('../services/gameService');


exports.add = async (req, res) => {
  const { token, data } = req.body;
  try {
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


exports.get = async (req, res) => {
  const { user, size, main } = req.query;
  // const tech = [{ user }, { size }, { main }];
  // console.log('arguments we got:', tech.reduce((acc, item) => {
  //   if (item) { acc[Object.keys(item)[0]] = Object.values(item)[0] }
  //   return acc;
  // }, {}));
  // console.log('user', user);
  // console.log('size', size);
  // console.log('test', main);
  try {
    if (main) {
      const levels = await gameService.getUserLevels('admin', req.token);
      res.json({ levels });
      return;
    }
    // res.json('дошли до конца эндпоинта /game/get');
  } catch (error) {
    console.error('Ошибка при получении уровней:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
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
