import express from "express";
import { UserLog } from "../models/UserLog.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { verifyRole } from "../middleware/verifyRole.js";

const logRouter = express.Router();

logRouter.get("/", verifyAuth, verifyRole(["admin"]), async (req, res) => {
  try {
    const logs = await UserLog.find().sort({ createdAt: -1 });
    res.json({ logs });
  } catch (error) {
    console.error("Fetch logs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default logRouter;
