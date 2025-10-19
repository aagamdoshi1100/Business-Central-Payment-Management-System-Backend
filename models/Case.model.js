import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return `CASE-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 5)
          .toUpperCase()}`;
      },
    },
    serviceProviderName: {
      type: String,
      required: true,
      trim: true,
    },
    workReferenceId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "paid", "overdue"],
      default: "open",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", CaseSchema);
export default Case;
