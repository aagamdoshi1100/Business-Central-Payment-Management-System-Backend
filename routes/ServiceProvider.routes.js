import express from "express";
import {
  deleteServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  registerServiceProvider,
  updateServiceProvider,
} from "../controller/ServiceProvider.controller.js";
const serviceProviderRouter = express.Router();

serviceProviderRouter.post("/", registerServiceProvider);
serviceProviderRouter.get("/", getAllServiceProviders);
serviceProviderRouter.get("/:id", getServiceProviderById);
serviceProviderRouter.put("/:id", updateServiceProvider);
serviceProviderRouter.delete("/:id", deleteServiceProvider);
//sss
export default serviceProviderRouter;
