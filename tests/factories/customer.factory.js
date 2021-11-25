import faker from "faker";
import bcrypt from "bcrypt";
import connection from "../../src/database/database";

function generateCustomerBody(user) {
  return {
    email: user?.email || faker.internet.email(),
    name: user?.name || faker.name.findName(),
    password: user?.password || "12a!3456",
  };
}

async function createCustomer() {
  const user = generateCustomerBody();
  const passwordHash = bcrypt.hashSync(user.password, 10);

  const insertedUser = await connection.query(
    `
            INSERT INTO customers 
            (email, name, password) 
            VALUES ($1, $2, $3) RETURNING id
            ;`,
    [user.email, user.name, passwordHash]
  );
  user.id = insertedUser.rows[0].id;
  return user;
}

export { generateCustomerBody, createCustomer };
