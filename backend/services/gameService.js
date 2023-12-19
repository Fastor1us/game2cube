const pool = require('../db/pool');


const createLevel = async (token, size) => {
  const { rows: [{ id }] } = await pool.query(`
    INSERT INTO game2cube.levels (user_id, size)
    VALUES ((SELECT id FROM game2cube.users WHERE token = $1), $2)
    RETURNING id
  `, [token, size]);
  return id;
}


const createCells = async (levelId, cells) => {
  const cellsValues = cells.map((_, index) =>
    `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`);
  const cellsQuery = `
    INSERT INTO game2cube.cells (level_id, row, col, number)
    VALUES ${cellsValues.join(', ')}
  `;
  const cellsParams = cells.reduce((acc, cell) => {
    acc.push(levelId, cell.address.row, cell.address.col, cell.number);
    return acc;
  }, []);
  await pool.query(cellsQuery, cellsParams);
}


const deleteLevel = async (token, levelId) => {
  const { rows } = await pool.query(`
    SELECT * FROM game2cube.levels AS l
    JOIN game2cube.users AS u ON l.user_id = u.id
    WHERE l.id = $1 AND u.token = $2
  `, [levelId, token]);
  if (rows.length > 0) {
    await pool.query(`
      DELETE FROM game2cube.levels
      WHERE id = $1
    `, [levelId]);
  } else {
    throw new Error('Пользователь не является владельцем таблицы');
  }
}


const isAbleToLike = async (token, levelId) => {
  const { rows } = await pool.query(`
    SELECT * FROM game2cube.likes AS l
    WHERE l.level_id = $1 AND 
    l.user_id = (SELECT id FROM game2cube.users WHERE token = $2)
  `, [levelId, token]);
  return !(rows.length > 0);
}


const getUserLevels = async (username, token) => {
  // Получаем все уровни пользователя
  const levelsResult = await pool.query(`
  SELECT l.id, l.size FROM game2cube.levels AS l
  JOIN game2cube.users AS u ON l.user_id = u.id
  WHERE u.username = $1
  `, [username]);
  // Получаем все ячейки для каждого уровня
  const levelsWithCells = await Promise.all(
    levelsResult.rows.map(async (level) => {
      const cellsResult = await pool.query(`
        SELECT c.row, c.col, c.number FROM game2cube.cells AS c
        WHERE c.level_id = $1
      `, [level.id]);
      return {
        author: username,
        levelId: level.id,
        likes: await amountOfLikes(level.id),
        isAbleToLike: token ? await isAbleToLike(token, level.id) : false,
        size: level.size,
        cells: cellsResult.rows
      };
    }));
  return levelsWithCells;
}

const getRandomLevels = async (token) => {
  // Получаем случайные 10 уровней
  const levelsResult = await pool.query(`
    SELECT l.id, l.user_id,l.size FROM game2cube.levels AS l
    JOIN game2cube.users AS u ON l.user_id = u.id
    ORDER BY random() LIMIT 10
  `);
  // Получаем все ячейки для каждого уровня
  const levelsWithCells = await Promise.all(
    levelsResult.rows.map(async (level) => {
      const authorResult = await pool.query(`
        SELECT username FROM game2cube.users
        WHERE id = $1
      `, [level.user_id]);
      const cellsResult = await pool.query(`
        SELECT c.row, c.col, c.number FROM game2cube.cells AS c
        WHERE c.level_id = $1
      `, [level.id]);
      return {
        author: authorResult.rows[0].username,
        levelId: level.id,
        likes: await amountOfLikes(level.id),
        isAbleToLike: token ? await isAbleToLike(token, level.id) : false,
        size: level.size,
        cells: cellsResult.rows
      };
    }));
  return levelsWithCells;
}

const addLike = async (token, levelId) => {
  await pool.query(`
  INSERT INTO game2cube.likes (user_id, level_id)
  VALUES ((SELECT id FROM game2cube.users WHERE token = $1), $2)
`, [token, levelId]);
}

const removeLike = async (token, levelId) => {
  await pool.query(`
    DELETE FROM game2cube.likes
    WHERE user_id = (SELECT id FROM game2cube.users WHERE token = $1)
    AND level_id = $2
  `, [token, levelId]);
}


module.exports = {
  createLevel,
  createCells,
  deleteLevel,
  isAbleToLike,
  getUserLevels,
  getRandomLevels,
  addLike,
  removeLike
};


async function amountOfLikes(levelId) {
  const { rows } = await pool.query(`
    SELECT count(*) FROM game2cube.likes AS l
    WHERE l.level_id = $1
  `, [levelId]);
  return rows[0].count;
}
