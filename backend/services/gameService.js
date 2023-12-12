
const createLevel = async (token, size) => {
  const { rows: [{ id }] } = await pool.query(`
    INSERT INTO game2cube.levels (user_id, size)
    VALUES ((SELECT id FROM game2cube.users WHERE token = $1), $2)
    RETURNING id
  `, [token, size]);
  return id;
}


module.exports = {
  createLevel,
};
