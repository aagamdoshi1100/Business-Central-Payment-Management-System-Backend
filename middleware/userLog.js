import UserLog from "../models/UserLog.model.js";

export const userLog = async (req, res, next) => {
  try {
    if (req.user) {
      await UserLog.create({
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.accessType,
        action: `${req.method} ${req.originalUrl}`,
        ipAddress: req.ip,
      });
    }
  } catch (err) {
    console.error("Log middleware error:", err.message);
  }
  next();
};
