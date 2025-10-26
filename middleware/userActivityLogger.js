import UserLog from "../models/UserLog.model.js";
import jwt from "jsonwebtoken";

export const userActivityLogger = async (req, res, next) => {
  try {
    let ipAddress =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket?.remoteAddress;
    if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
      ipAddress = "localhost";
    }

    const method = req.method;
    const path = req.originalUrl;

    const token = req.cookies?.auth_token;
    let userId = null;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    const action = `${method} ${path}`;

    await UserLog.create({
      userId,
      action,
      ipAddress,
    });

    next();
  } catch (error) {
    console.error("Logging middleware error:", error);
    next();
  }
};
