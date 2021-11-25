import express from "express";
import {
  getTransactions,
  storeTransaction,
} from "./controllers/transaction.controller.js";
import { getUser, storeUser } from "./controllers/user.controller.js";
import auth from "./middlewares/auth.js";

const routes = express.Router();

routes.post("/sign-up", storeUser);
routes.post("/sign-in", getUser);
routes.post("/user/payments/new", auth, storeTransaction);
routes.get("/user/payments", auth, getTransactions);

export default routes;
