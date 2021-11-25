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
  const user = generateTransactionBody();
  const passwordHash = bcrypt.hashSync(user.password, 10);

  const insertedUser = await connection.query(
    `
          INSERT INTO customers 
          (email, name, password) 
          VALUES ($1, $2, $3)
          ;`,
    [user.email, user.name, passwordHash]
  );

  return user;
}

export { generateTransactionBody, createTransaction };
