import pg from "pg";

const { Pool } = pg;
const database = {
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'teste'
}

const connection = new Pool(database);

export default connection;