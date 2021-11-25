import faker from "faker";
import dayjs from "dayjs";
import connection from "../../src/database/database";

function generateTransactionBody() {
  return {
    value: faker.datatype.number(),
    type: "entry",
    date: dayjs().format("YYYY-MM-DD"),
    describe: faker.datatype.string(),
  };
}

async function createTransaction() {
  const transaction = generateTransactionBody();
  const passwordHash = bcrypt.hashSync(transaction.password, 10);

  await connection.query(
    `
          INSERT INTO customers 
          (email, name, password) 
          VALUES ($1, $2, $3)
          ;`,
    [transaction.email, transaction.name, passwordHash]
  );

  return transaction;
}

export { generateTransactionBody, createTransaction };
