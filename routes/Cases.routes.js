import express from "express";
import {
  createCase,
  getCaseById,
  getAllCases,
  updateCaseById,
  validateWorkId,
} from "../controller/cases.controller.js";
import validate from "../middleware/validate.js";
import { caseValidationSchema } from "../validations/case.validation.js";
const caseRouter = express.Router();

caseRouter.post("/", validate(caseValidationSchema), createCase);
caseRouter.get("/", getAllCases);
caseRouter.post("/validateWorkId", validateWorkId);
caseRouter.get("/:id", getCaseById);
caseRouter.put("/:id", updateCaseById);

export default caseRouter;
