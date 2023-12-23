--========================================================================== 
--create_user
CREATE OR REPLACE PROCEDURE game2cube.create_user(
  IN username varchar(25),
  IN email varchar(25),
  IN password varchar(25),
  IN token varchar(25),
  IN avatar varchar(25),
  IN register_date timestamp,
  IN last_seen timestamp
)
AS $$
BEGIN
  INSERT INTO game2cube.users(username, email, password, token, avatar, register_date, last_seen)
  VALUES(username, email, password, token, avatar, register_date, last_seen);
END;
$$ LANGUAGE plpgsql;

-- не забываем  после создания скрипта выдать права для пользователя express
GRANT EXECUTE ON PROCEDURE game2cube.create_user(
  varchar, varchar, varchar, varchar, varchar, timestamp, timestamp) TO express;
--==========================================================================


--========================================================================== 
--create_registration
CREATE OR REPLACE PROCEDURE game2cube.create_registration(
  username varchar(25),
  email varchar(25),
  password varchar(25),
  code integer
)
AS $$
BEGIN
  INSERT INTO game2cube.registration(username, email, password, code)
  VALUES(username, email, password, code);
END;
$$ LANGUAGE plpgsql;

-- не забываем  после создания скрипта выдать права для пользователя express
GRANT EXECUTE ON PROCEDURE game2cube.create_registration(
  varchar, varchar, varchar, int4) TO express;
--==========================================================================


--========================================================================== 
--delete_registration
CREATE OR REPLACE PROCEDURE game2cube.delete_registration(IN p_email character varying)
LANGUAGE plpgsql
AS $procedure$
BEGIN
  DELETE FROM game2cube.registration WHERE email = p_email;
END;
$procedure$;

GRANT EXECUTE ON PROCEDURE game2cube.delete_registration(varchar) TO express;
--==========================================================================


--========================================================================== 
--read_registration
CREATE OR REPLACE FUNCTION game2cube.read_registration(
  IN p_email varchar(25),
  IN p_code integer
)
RETURNS SETOF game2cube.registration
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT * FROM game2cube.registration 
  WHERE email = p_email
  AND code = p_code;
END;
$function$;

GRANT EXECUTE ON FUNCTION game2cube.read_registration(varchar, int4) TO express;
--==========================================================================


--========================================================================== 
--read_registration
CREATE OR REPLACE FUNCTION game2cube.read_registration(
  IN p_email varchar(25)
)
RETURNS SETOF game2cube.registration
LANGUAGE plpgsql
AS $function$
begin
  RETURN QUERY
  SELECT * FROM game2cube.registration 
  WHERE email = p_email;
END;
$function$;

GRANT EXECUTE ON FUNCTION game2cube.read_registration(varchar) TO express;
--==========================================================================


--========================================================================== 
--get_user
CREATE OR REPLACE FUNCTION game2cube.get_user(
  IN p_token varchar(25)
)
RETURNS SETOF game2cube.users
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT * FROM game2cube.users 
  WHERE token = p_token;
END;
$function$;

GRANT EXECUTE ON FUNCTION game2cube.get_user(varchar) TO express;
--==========================================================================


--========================================================================== 
--get_user
CREATE OR REPLACE FUNCTION game2cube.get_user(
  IN p_email varchar(25),
  IN p_password varchar(25)
)
RETURNS SETOF game2cube.users
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT * FROM game2cube.users 
  WHERE email = p_email
  AND password = p_password;
END;
$function$;

GRANT EXECUTE ON FUNCTION game2cube.get_user(varchar, varchar) TO express;
--==========================================================================


--========================================================================== 
--read_user
-- CREATE OR REPLACE FUNCTION game2cube.read_user(
--   p_column varchar(25),
--   p_value varchar(25)
-- )
--  RETURNS SETOF game2cube.users
--  LANGUAGE plpgsql
-- AS $function$
-- BEGIN
--   RETURN QUERY EXECUTE format('SELECT * FROM game2cube.users WHERE %I = $1', p_column)
--   USING p_value;
-- END;
-- $function$;
CREATE OR REPLACE FUNCTION game2cube.read_user(
  p_column varchar(25),
  p_value varchar(25)
)
RETURNS game2cube.users
LANGUAGE plpgsql
AS $function$
DECLARE
  user_data game2cube.users;
BEGIN
  EXECUTE format('SELECT * FROM game2cube.users WHERE %I = $1', p_column)
  INTO user_data
  USING p_value;
  RETURN user_data;
END;
$function$;

GRANT EXECUTE ON FUNCTION game2cube.read_user(varchar, varchar) TO express;
--==========================================================================


--========================================================================== 
--delete_user
-- два варианта объявление процедуру с разным синтаксисом
-- 1)
CREATE OR REPLACE PROCEDURE game2cube.delete_user(
  IN p_token varchar(25)
)
AS $$
BEGIN
  DELETE FROM game2cube.users
  WHERE token = p_token;
END;
$$ LANGUAGE plpgsql;
-- 2)
-- CREATE OR REPLACE PROCEDURE game2cube.delete_user(
--   IN p_token varchar(25)
-- )
-- LANGUAGE plpgsql
-- AS $procedure$
-- BEGIN
--   DELETE FROM game2cube.users WHERE token = p_token;
-- END;
-- $procedure$;

GRANT EXECUTE ON PROCEDURE game2cube.delete_user(varchar) TO express;
--========================================================================== 


--========================================================================== 
--update_user
-- CREATE OR REPLACE PROCEDURE game2cube.update_user(
--   p_token varchar(25),
--   p_username varchar(25),
--   p_password varchar(25)
-- )
-- AS $$
-- BEGIN
--   UPDATE game2cube.users
--   SET username = COALESCE(p_username, username),
--       password = COALESCE(p_password, password)
--   WHERE token = p_token;
-- END;
-- $$ LANGUAGE plpgsql;
CREATE OR REPLACE PROCEDURE game2cube.update_user(
  p_token varchar(25),
  p_username varchar(25) DEFAULT NULL,
  p_password varchar(25) DEFAULT NULL,
  p_avatar varchar(25) DEFAULT NULL,
  p_last_seen timestamp DEFAULT NULL
)
LANGUAGE plpgsql
AS $procedure$
BEGIN
  UPDATE game2cube.users
  SET username = COALESCE(p_username, username),
      password = COALESCE(p_password, password),
      avatar = COALESCE(p_avatar, avatar),
      last_seen = COALESCE(p_last_seen, last_seen)
  WHERE token = p_token;
END;
$procedure$;

GRANT EXECUTE ON PROCEDURE game2cube.update_user(
  varchar, varchar, varchar, varchar, timestamp) TO express;
--==========================================================================


--========================================================================== 
--create_recovery
CREATE OR REPLACE PROCEDURE game2cube.create_recovery(
  email varchar(25),
  code integer,
  attempt integer
)
AS $$
BEGIN
  INSERT INTO game2cube.recovery(email, code, attempt)
  VALUES(email, code, attempt);
END;
$$ LANGUAGE plpgsql;

-- не забываем  после создания скрипта выдать права для пользователя express
GRANT EXECUTE ON PROCEDURE game2cube.create_recovery(
  varchar, int4, int4) TO express;
--==========================================================================


--========================================================================== 
--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
--ответ в виде:  
--response [
--   { read_recovery: { id: 19, code: 4102, email: 'fewgwer3@ya.ru', attempt: 1  } }
-- ]
--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
--read_recovery
CREATE OR REPLACE FUNCTION game2cube.read_recovery(p_email character varying)
RETURNS game2cube.recovery
LANGUAGE plpgsql
AS $function$
DECLARE
  recovery_data game2cube.recovery;
BEGIN
  SELECT *
  INTO recovery_data
  FROM game2cube.recovery
  WHERE email = p_email;
  RETURN recovery_data;
END;
$function$;

GRANT EXECUTE ON FUNCTION game2cube.read_recovery(varchar) TO express;
--==========================================================================


--========================================================================== 
--delete_recovery
CREATE OR REPLACE PROCEDURE game2cube.delete_recovery(
  IN p_email varchar(25)
)
AS $$
BEGIN
  DELETE FROM game2cube.recovery
  WHERE email = p_email;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON PROCEDURE game2cube.delete_recovery(varchar) TO express;
--========================================================================== 


--========================================================================== 
--delete_recovery
CREATE OR REPLACE PROCEDURE game2cube.update_recovery(
  p_email varchar(25),
  p_attempt integer
)
LANGUAGE plpgsql
AS $procedure$
BEGIN
  UPDATE game2cube.recovery
  SET attempt = p_attempt
  WHERE email = p_email;
END;
$procedure$;

GRANT EXECUTE ON PROCEDURE game2cube.update_recovery(varchar, int4) TO express;
--========================================================================== 
