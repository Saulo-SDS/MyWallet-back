import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository.js";

async function createUser({ name, email, password }) {
  const hashedPassword = bcrypt.hashSync(password, 12);
  await userRepository.create({ name, email, hashedPassword });
}

async function verifyEmail(email) {
  const user = userRepository.findByEmail(email);
  return user;
}

async function authenticate({ email, password }) {
  const user = await userRepository.findByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return null;
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET
  );
  return { name: user.name, token };
}

export { createUser, verifyEmail, authenticate };
