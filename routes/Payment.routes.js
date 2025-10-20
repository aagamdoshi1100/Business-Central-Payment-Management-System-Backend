import express from "express";
import { createPayment } from "../controller/Payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/", createPayment);

export default paymentRouter;
