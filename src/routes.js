import express from "express";
import { getPayments, storePayment } from "./controllers/payment.controller.js";
import { deleteSession } from "./controllers/session.controller.js";
import { getUser, storeUser } from "./controllers/user.controller.js";

const routes = express.Router();
routes.post('/sing-up', storeUser);
routes.get('/sing-in', getUser);
routes.post('/user/payment/new', storePayment);
routes.get('/user/payments', getPayments);
routes.delete('/logout', deleteSession);

export default routes;