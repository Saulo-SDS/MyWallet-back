import { userSchema } from "../Validate/schemas.js";
import * as userService from "../service/user.service.js";

async function storeUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const validate = userSchema.validate({ name, email, password });

    if (validate.error) return res.sendStatus(400);

    const existingUserWithGivenEmail = await userService.verifyEmail(email);
    if (existingUserWithGivenEmail) {
      return res.sendStatus(409);
    }

    await userService.createUser({ name, email, password });

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}

async function getUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const session = await userService.authenticate({ email, password });
    if (session) {
      res.send(session);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.sendStatus(500);
  }
}

export { storeUser, getUser };
