import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  findUserAndDelete,
  findUserAndUpdate,
  verifyUser,
  logout,
  me,
} from "../controller/users.controller.js";
import validate from "../middleware/validate.js";
import { userSchema, loginSchema } from "../validations/user.validation.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { verifyRole } from "../middleware/verifyRole.js";

const userRouter = express.Router();

userRouter.post("/signup", validate(userSchema), createUser);
userRouter.post("/login", validate(loginSchema), verifyUser);
userRouter.post("/logout", logout);

userRouter.get("/", verifyAuth, getAllUsers);
userRouter.get("/me", verifyAuth, me);
userRouter.get("/:id", verifyAuth, getUserById);
userRouter.delete("/:id", verifyAuth, verifyRole(["admin"]), findUserAndDelete);
userRouter.put("/:id", verifyAuth, verifyRole(["admin"]), findUserAndUpdate);

export default userRouter;
