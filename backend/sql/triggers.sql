--========================================================================== 
-- Создание функции, которая будет удалять старые записи таблицы registration
CREATE OR REPLACE FUNCTION game2cube.delete_oldest_registration() RETURNS TRIGGER AS $$
DECLARE
  registration_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO registration_count FROM game2cube.registration;
  
  IF registration_count > 100 THEN
    DELETE FROM game2cube.registration
    WHERE id = (SELECT id FROM game2cube.registration ORDER BY id ASC LIMIT 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Гранты
GRANT EXECUTE ON FUNCTION game2cube.delete_oldest_registration() TO express;

-- Создание триггера, который будет вызывать функцию при добавлении новых записей
CREATE TRIGGER registration_limit_trigger
AFTER INSERT ON game2cube.registration
FOR EACH ROW
EXECUTE PROCEDURE game2cube.delete_oldest_registration();

-- Что бы найти триггер:
SELECT *
FROM pg_trigger
WHERE tgname = 'registration_limit_trigger';

-- Что бы удалить триггер:
-- DROP FUNCTION game2cube.delete_oldest_registration() CASCADE;
--========================================================================== 


--========================================================================== 
-- Создание функции, которая будет удалять старые записи таблицы recovery
CREATE OR REPLACE FUNCTION game2cube.delete_oldest_recovery() RETURNS TRIGGER AS $$
DECLARE
  recovery_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recovery_count FROM game2cube.recovery;
  
  IF recovery_count > 100 THEN
    DELETE FROM game2cube.recovery
    WHERE id = (SELECT id FROM game2cube.recovery ORDER BY id ASC LIMIT 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Гранты
GRANT EXECUTE ON FUNCTION game2cube.delete_oldest_recovery() TO express;

-- Создание триггера, который будет вызывать функцию при добавлении новых записей
CREATE TRIGGER recovery_limit_trigger
AFTER INSERT ON game2cube.recovery
FOR EACH ROW
EXECUTE PROCEDURE game2cube.delete_oldest_recovery();

-- Что бы найти триггер:
SELECT *
FROM pg_trigger
WHERE tgname = 'recovery_limit_trigger';

-- Что бы удалить триггер:
-- DROP FUNCTION game2cube.delete_oldest_recovery() CASCADE;
--========================================================================== 
