CREATE TABLE game2cube.registration (
  id SERIAL PRIMARY KEY,
  username varchar(25),
  email varchar(25),
  password varchar(25),
  code smallint
);

CREATE TABLE game2cube.users (
  id SERIAL PRIMARY KEY,
  username varchar(25) UNIQUE,
  email varchar(25) UNIQUE,
  password varchar(25),
  token varchar(25),
  avatar varchar(25)
);

CREATE TABLE game2cube.recovery (
  id SERIAL PRIMARY KEY,
  email varchar(25) UNIQUE,
  code smallint
);

CREATE TABLE game2cube.levels (
  id SERIAL PRIMARY KEY,
  user_id smallint,
  size smallint
);

CREATE TABLE game2cube.cells (
  id SERIAL PRIMARY KEY,
  level_id smallint,
  row smallint,
  col smallint,
  number smallint
);

CREATE TABLE game2cube.likes (
  id SERIAL PRIMARY KEY,
  level_id smallint,
  user_id smallint
);
-- что бы один юзер не мог лайкнуть один уровень более одного раза:
CREATE UNIQUE INDEX idx_likes_level_user ON game2cube.likes (level_id, user_id);

--======================= внешние ключи =======================
-- зависимость для каскадного удаления cells.level_id -> levels.id
ALTER TABLE game2cube.cells
ADD CONSTRAINT fk_cells_level
FOREIGN KEY (level_id)
REFERENCES game2cube.levels(id)
ON DELETE CASCADE;
-- зависимость для каскадного удаления levels.user_id -> users.id
ALTER TABLE game2cube.levels
ADD CONSTRAINT fk_levels_user
FOREIGN KEY (user_id)
REFERENCES game2cube.users(id)
ON DELETE CASCADE;
-- зависимость для каскадного удаления likes.level_id -> levels.id
ALTER TABLE game2cube.likes
ADD CONSTRAINT fk_likes_level
FOREIGN KEY (level_id)
REFERENCES game2cube.levels(id)
ON DELETE CASCADE;
-- зависимость для каскадного удаления likes.level_id -> levels.id
ALTER TABLE game2cube.likes
ADD CONSTRAINT fk_likes_user
FOREIGN KEY (user_id)
REFERENCES game2cube.users(id)
ON DELETE CASCADE;
--=============================================================

-- не забываем выдать права для пользователя express:
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.registration TO express;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.users TO express;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.recovery TO express;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.levels TO express;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.cells TO express;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.likes TO express;

--==========================================================================


--==========================================================================

-- гранты для express, для использования SEQUENCES (для id) во всех таблицах
GRANT USAGE ON ALL SEQUENCES IN schema game2cube to express;

--==========================================================================
