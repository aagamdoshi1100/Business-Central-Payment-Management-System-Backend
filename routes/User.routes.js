import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  findUserAndDelete,
  findUserAndUpdate,
} from "../controller/users.controller.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", findUserAndDelete);
userRouter.put("/:id", findUserAndUpdate);

export default userRouter;
