import pg from "pg";

const { Pool } = pg;

let databaseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

if (process.env.NODE_ENV === "prod") {
  databaseConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const connection = new Pool(databaseConfig);

export default connection;
