import mongoose from "mongoose";

const bulkLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  duplicates: Number,
  validCases: Number,
  invalidCases: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7, // 🔥 Auto delete after 7 days (TTL index)
  },
});

// TTL index will automatically be created on createdAt field
const BulkLog = mongoose.model("BulkLog", bulkLogSchema);
export default BulkLog;
