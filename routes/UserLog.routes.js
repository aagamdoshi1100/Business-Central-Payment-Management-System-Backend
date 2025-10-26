import express from "express";
import { verifyRole } from "../middleware/verifyRole.js";
import { fetchLogsBypage } from "../controller/logs.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const logRouter = express.Router();

logRouter.use(verifyAuth);

logRouter.get("/", verifyRole(["admin"]), fetchLogsBypage);

export default logRouter;
