import express from "express";
import {
  createPayment,
  getkeyValues,
} from "../controller/Payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/", createPayment);
paymentRouter.get("/getBasicDetails", getkeyValues);

export default paymentRouter;
