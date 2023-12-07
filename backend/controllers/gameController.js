// services/userService.js
const pool = require('../db/pool');

exports.add = async (req, res) => {
  const { token, data } = req.body;
  console.log('token', token);
  console.log('data', data);

  // делаем запись об уровне в levels
  const { rows: [{ id }] } = await pool.query(`
    INSERT INTO game2cube.levels (user_id, size)
    VALUES ((SELECT id FROM game2cube.users WHERE token = $1), $2)
    RETURNING id
  `, [token, data.size]);

  console.log('id', id);

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
  console.log('cellsQuery', cellsQuery);
  console.log('cellsParams', cellsParams);
  await pool.query(cellsQuery, cellsParams);

  res.status(200).json({ token, data });
}
