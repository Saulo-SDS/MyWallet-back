import express from "express";
import { storeUser } from "./controllers/user.controller.js";

const routes = express.Router();
routes.post('/sing-up', storeUser);

export default routes;