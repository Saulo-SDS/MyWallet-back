import express from "express";
import { getPayments, storePayment } from "./controllers/payment.controller.js";
import { deleteSession } from "./controllers/session.controller.js";
import { getUser, storeUser } from "./controllers/user.controller.js";

const routes = express.Router();

routes.post('/sign-up', storeUser);
routes.get('/sign-in', getUser);
routes.post('/user/payments/new', storePayment);
routes.get('/user/payments', getPayments);
routes.delete('/user/logout', deleteSession);

export default routes;