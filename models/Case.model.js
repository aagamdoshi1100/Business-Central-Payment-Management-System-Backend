import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, required: true, unique: true },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["open", "paid", "overdue"],
      default: "open",
    },
    notes: String,
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", CaseSchema);
export default Case;
