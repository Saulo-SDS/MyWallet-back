import connection from "../database/database.js";

async function findByEmail(email) {
  const result = await connection.query(
    `
      SELECT * FROM customers
      WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
}

async function create({ name, email, hashedPassword }) {
  await connection.query(
    `INSERT INTO customers ("name", "email", "password") VALUES ($1, $2, $3)`,
    [name, email, hashedPassword]
  );
}

export { findByEmail, create };
