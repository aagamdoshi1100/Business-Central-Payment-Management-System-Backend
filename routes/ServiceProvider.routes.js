import express from "express";
import {
  deleteServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  registerServiceProvider,
  updateServiceProvider,
} from "../controller/ServiceProvider.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
const serviceProviderRouter = express.Router();

serviceProviderRouter.use(verifyAuth);

serviceProviderRouter.post("/", registerServiceProvider);
serviceProviderRouter.get("/", getAllServiceProviders);
serviceProviderRouter.get("/:id", getServiceProviderById);
serviceProviderRouter.put("/:id", updateServiceProvider);
serviceProviderRouter.delete("/:id", deleteServiceProvider);

export default serviceProviderRouter;
