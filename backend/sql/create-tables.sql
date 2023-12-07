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
  token varchar(25)
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


-- не забываем выдать права для пользователя express:
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.registration TO express;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.users TO express;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.levels TO express;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE game2cube.cells TO express;

GRANT USAGE ON ALL SEQUENCES IN schema game2cube to express;

--==========================================================================
