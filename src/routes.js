import express from "express";
import {
  getPayments,
  storePayment,
} from "./controllers/transaction.controller.js";
import { getUser, storeUser } from "./controllers/user.controller.js";
import { deleteSession } from "./controllers/session.controller.js";

const routes = express.Router();

routes.post("/sign-up", storeUser);
routes.post("/sign-in", getUser);
routes.post("/user/payments/new", storePayment);
routes.get("/user/payments", getPayments);
routes.delete("/user/logout", deleteSession);

export default routes;
