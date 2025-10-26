import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  action: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7, // 🔥 Auto delete after 7 days (TTL index)
  },
});

// TTL index will automatically be created on createdAt field
const UserLog = mongoose.model("UserLog", userLogSchema);
export default UserLog;
