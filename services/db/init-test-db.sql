DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'mydb_test') THEN
      CREATE DATABASE mydb_test;
   END IF;
END
$$;