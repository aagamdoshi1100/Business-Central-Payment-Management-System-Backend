import express from "express";
import {
  createCase,
  getCaseById,
  getAllCases,
  updateCaseById,
} from "../controller/cases.controller.js";
const caseRouter = express.Router();

caseRouter.post("/", createCase);
caseRouter.get("/", getAllCases);
caseRouter.get("/:id", getCaseById);
caseRouter.put("/:id", updateCaseById);

export default caseRouter;
