import connection from "../database/database.js";

async function create({ id, value, type, date, describe }) {
  const resulTransaction = await connection.query(
    "INSERT INTO transactions (value, type, date, describe) VALUES ($1, $2, $3, $4) RETURNING id",
    [value, type, date, describe]
  );
  const id_transaction = resulTransaction.rows[0].id;
  await connection.query(
    `INSERT INTO customer_transactions (id_customer, id_transaction) VALUES ($1, $2)`,
    [id, id_transaction]
  );
}

async function getAllFinancesForUser({ id }) {
  const resulTransaction = await connection.query(
    `SELECT 
         t.value,
         t.type,
         t.date,
         t.describe
         FROM customer_transactions AS ct
         JOIN transactions AS t ON t.id = ct.id_transaction
         WHERE id_customer = $1
        `,
    [id]
  );

  return resulTransaction.rows;
}

async function getSumTransactionsUser({ id }) {
  const resulTransaction = await connection.query(
    `SELECT 
      SUM(t.value) AS balance
      FROM customer_transactions AS ct
      LEFT JOIN transactions AS t ON t.id = ct.id_transaction
      WHERE id_customer = $1
          `,
    [id]
  );

  return resulTransaction.rows[0];
}

export { create, getAllFinancesForUser, getSumTransactionsUser };
