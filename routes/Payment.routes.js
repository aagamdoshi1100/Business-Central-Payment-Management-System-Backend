import express from "express";
import {
  createPayment,
  getkeyValues,
  generateReport,
  getTransactionDetailsByCaseId,
} from "../controller/Payment.controller.js";
import validate from "../middleware/validate.js";
import { reportFilterSchema } from "../validations/report.validation.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const paymentRouter = express.Router();

paymentRouter.use(verifyAuth);

paymentRouter.post("/", createPayment);
paymentRouter.get("/getBasicDetails", getkeyValues);
paymentRouter.post("/report", validate(reportFilterSchema), generateReport);
paymentRouter.get("/cases/:caseId", getTransactionDetailsByCaseId);

export default paymentRouter;
