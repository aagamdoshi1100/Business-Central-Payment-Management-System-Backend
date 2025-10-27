import express from "express";
import {
  createPayment,
  getkeyValues,
  generateReport,
  getTransactionDetailsByCaseId,
  getAllPayments,
} from "../controller/Payment.controller.js";
import validate from "../middleware/validate.js";
import { reportFilterSchema } from "../validations/report.validation.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { verifyRole } from "../middleware/verifyRole.js";

const paymentRouter = express.Router();

paymentRouter.use(verifyAuth);

paymentRouter.post("/", createPayment);
paymentRouter.get(
  "/getBasicDetails",
  verifyRole(["admin", "finance", "auditor"]),
  getkeyValues
);

paymentRouter.get(
  "/getPaymentSummary",
  verifyRole(["admin", "finance", "auditor"]),
  getAllPayments
);

paymentRouter.post(
  "/report",
  validate(reportFilterSchema),
  verifyRole(["admin", "auditor"]),
  generateReport
);
paymentRouter.get("/cases/:caseId", getTransactionDetailsByCaseId);

export default paymentRouter;
