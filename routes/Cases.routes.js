import express from "express";
import {
  createCase,
  getCaseById,
  getAllCases,
  updateCaseByCaseNumber,
  validateWorkId,
  createBulkCases,
} from "../controller/cases.controller.js";
import validate from "../middleware/validate.js";
import { caseValidationSchema } from "../validations/case.validation.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const caseRouter = express.Router();

caseRouter.use(verifyAuth);

caseRouter.post("/", validate(caseValidationSchema), createCase);
caseRouter.post("/createBulkCases", createBulkCases);
caseRouter.get("/", getAllCases);
caseRouter.post("/validateWorkId", validateWorkId);
caseRouter.get("/:id", getCaseById);
caseRouter.put("/:caseNumber", updateCaseByCaseNumber);

export default caseRouter;
