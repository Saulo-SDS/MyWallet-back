import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connection from "../database/database.js";
import { userSchema } from "../Validate/schemas.js";

async function storeUser(req, res) {
  const { name, email, password } = req.body;
  const validate = userSchema.validate({ name, email, password });

  if (validate.error) return res.sendStatus(400);

  try {
    const user = await connection.query(
      "SELECT * FROM customers WHERE email = $1;",
      [email]
    );
    if (user.rows[0]) return res.sendStatus(409);

    const passwordHash = bcrypt.hashSync(password, 10);
    await connection.query(
      "INSERT INTO customers (name, email, password) VALUES ($1, $2, $3)",
      [name, email, passwordHash]
    );

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function getUser(req, res) {
  try {
    const { email, password } = req.body;
    const resul = await connection.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );
    const user = resul.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password))
      return res.sendStatus(400);

    const data = { userId: user.id };
    const config = { expiresIn: 60 * 60 * 24 };
    const token = jwt.sign(data, process.env.JWT_SECRET, config);

    res.send({ token, name: user.name });
  } catch (error) {
    res.sendStatus(500);
  }
}

export { storeUser, getUser };
