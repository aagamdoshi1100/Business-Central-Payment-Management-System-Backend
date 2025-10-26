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

    NetAmount: { type: Number, required: true, min: 0 },
    baseAmount: { type: Number, default: 0 },
    GSTAmount: { type: Number, default: 0 },
    TDSAmount: { type: Number, default: 0 },
    TradeDiscountAmount: { type: Number, default: 0 },
    convenienceCharges: { type: Number, default: 0 },
    SLAType: String,
    SLAAmountValue: { type: Number, default: 0 },
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
