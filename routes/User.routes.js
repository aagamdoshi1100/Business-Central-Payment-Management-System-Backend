import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  findUserAndDelete,
  findUserAndUpdate,
  verifyUser,
  logout,
} from "../controller/users.controller.js";
import validate from "../middleware/validate.js";
import { userSchema, loginSchema } from "../validations/user.validation.js";

const userRouter = express.Router();

userRouter.post("/signup", validate(userSchema), createUser);
userRouter.post("/login", validate(loginSchema), verifyUser);
userRouter.post("/logout", logout);

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", findUserAndDelete);
userRouter.put("/:id", findUserAndUpdate);

export default userRouter;
