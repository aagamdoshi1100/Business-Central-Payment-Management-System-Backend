import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    serviceProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true, min: 0 },
    // penaltyValue: { type: Number, default: 0 },
    // incentiveValue: { type: Number, default: 0 },
    // tradeDiscountValue: { type: Number, default: 0 },
    // convenienceChargeValue: { type: Number, default: 0 },
    // tdsValue: { type: Number, default: 0 },

    // finalPayableAmount: { type: Number, required: true },

    paymentMode: {
      type: String,
      enum: ["UPI", "NEFT", "IMPS", "Cheque"],
    },
    transactionId: { type: String },
    paymentDate: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
