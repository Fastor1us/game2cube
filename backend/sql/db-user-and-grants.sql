
--===================================================================================================
--============================= проверка прав конкретного пользователя
--===================================================================================================
SELECT table_schema, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'express';


--===================================================================================================
--============================= удаление пользователя
--===================================================================================================
-- Удаление пользователя
DROP USER IF EXISTS user_name;


--===================================================================================================
--============================= создание пользователя express
--===================================================================================================
DO $$
DECLARE
  username text := 'express';
  password text := 'gfhjkmr<L';
  database_name text := 'your_database';
  schema_name text := 'game2cube';
BEGIN
  -- Создание пользователя
  EXECUTE format('CREATE USER %I WITH PASSWORD %L', username, password);
  -- Назначение привилегий на базу данных
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO %I', database_name, username);
  -- Назначение привилегий на схему
  EXECUTE format('GRANT USAGE ON SCHEMA %I TO %I', schema_name, username);
  -- Назначение привилегий на все таблицы в схеме
  EXECUTE format('GRANT SELECT, INSERT, DELETE, UPDATE ON ALL TABLES IN SCHEMA %I TO %I', schema_name, username);
  -- Даём возмонжость использовать SEQUENCES
  EXECUTE format('GRANT USAGE ON ALL SEQUENCES IN SCHEMA %I TO %I', schema_name, username);
END;
$$;
