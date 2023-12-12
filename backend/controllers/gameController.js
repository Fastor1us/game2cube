const pool = require('../db/pool');

const gameService = require('../services/gameService');


// TODO перенести все await.pool.query в Service 
exports.add = async (req, res) => {
  const { token, data } = req.body;
  try {
    // делаем запись об уровне в levels
    const { rows: [{ id }] } = await pool.query(`
    INSERT INTO game2cube.levels (user_id, size)
    VALUES ((SELECT id FROM game2cube.users WHERE token = $1), $2)
    RETURNING id
  `, [token, data.size]);

    // делаем запись игровых ячеек в cells
    const cellsValues = data.cells.map((_, index) =>
      `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`);
    const cellsQuery = `
    INSERT INTO game2cube.cells (level_id, row, col, number)
    VALUES ${cellsValues.join(', ')}
  `;
    const cellsParams = data.cells.reduce((acc, cell) => {
      acc.push(id, cell.address.row, cell.address.col, cell.number);
      return acc;
    }, []);
    await pool.query(cellsQuery, cellsParams);

    res.status(200).json({ token, data });
  } catch (error) {
    console.error('Ошибка при создании записи уровня:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
    return;
  }
}

// exports.add = async (req, res) => {
//   const { token, data } = req.body;

//   // делаем запись об уровне в levels
//   const { rows: [{ id }] } = await pool.query(`
//     INSERT INTO game2cube.levels (user_id, size)
//     VALUES ((SELECT id FROM game2cube.users WHERE token = $1), $2)
//     RETURNING id
//   `, [token, data.size]);

//   // делаем запись игровых ячеек в cells
//   const cellsValues = data.cells.map((_, index) =>
//     `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`);
//   const cellsQuery = `
//     INSERT INTO game2cube.cells (level_id, row, col, number)
//     VALUES ${cellsValues.join(', ')}
//   `;
//   const cellsParams = data.cells.reduce((acc, cell) => {
//     acc.push(id, cell.address.row, cell.address.col, cell.number);
//     return acc;
//   }, []);
//   await pool.query(cellsQuery, cellsParams);

//   res.status(200).json({ token, data });
// }



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

  if (main) {
    // Получаем все уровни пользователя admin
    const levelsResult = await pool.query(`
      SELECT l.id, l.size FROM game2cube.levels AS l
      JOIN game2cube.users AS u ON l.user_id = u.id
      WHERE u.username = 'admin'
    `);
    // Получаем все ячейки для каждого уровня
    const levelsWithCells = await Promise.all(
      levelsResult.rows.map(async (level) => {
        const cellsResult = await pool.query(`
          SELECT c.row, c.col, c.number FROM game2cube.cells AS c
          WHERE c.level_id = $1
        `, [level.id]);
        return {
          size: level.size,
          cells: cellsResult.rows
        };
      }));
    res.json({
      username: user,
      levels: levelsWithCells
    });
    return;
  }

  res.json('дошли до конца эендпоинта /game/get');
}

// const { rows: levels } = await pool.query(`
//   SELECT * FROM game2cube.levels
//   WHERE user_id = (SELECT id FROM game2cube.users WHERE token = $1)
// `, [token]);
