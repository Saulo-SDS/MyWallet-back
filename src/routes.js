import express from "express";
import { getUser, storeUser } from "./controllers/user.controller.js";

const routes = express.Router();
routes.post('/sing-up', storeUser);
routes.get('/sing-in', getUser);

export default routes;