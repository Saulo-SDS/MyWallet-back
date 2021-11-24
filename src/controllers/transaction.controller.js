import connection from "../database/database.js";
import { paymentSchema } from "../Validate/schemas.js";

async function storeTransaction(req, res) {
  const { value, type, describe, date } = req.body;
  const { userId } = req;
  const validate = paymentSchema.validate({ value, type, describe, date });
  if (validate.error) return res.sendStatus(400);

  try {
    const resulTransaction = await connection.query(
      "INSERT INTO transactions (value, type, date, describe) VALUES ($1, $2, $3, $4) RETURNING id",
      [value, type, date, describe]
    );

    const id_transaction = resulTransaction.rows[0].id;

    await connection.query(
      "INSERT INTO customer_transactions (id_customer, id_transaction) VALUES ($1, $2) RETURNING id",
      [userId, id_transaction]
    );

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function getTransactions(req, res) {
  const { userId } = req;

  try {
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
      [userId]
    );

    const resulSoma = await connection.query(
      `SELECT 
       SUM(t.value) AS balance
       FROM customer_transactions AS ct
       LEFT JOIN transactions AS t ON t.id = ct.id_transaction
       WHERE id_customer = $1
      `,
      [userId]
    );

    const transactions = resulTransaction.rows;
    const { balance } = resulSoma.rows[0];

    const data = { transactions, balance };
    res.send(data);
  } catch (error) {
    res.sendStatus(500);
  }
}

export { storeTransaction, getTransactions };
