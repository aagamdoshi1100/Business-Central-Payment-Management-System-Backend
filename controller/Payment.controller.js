import mongoose from "mongoose";
import Case from "../models/Case.model.js";
import { Payment } from "../models/Payment.model.js";
import { generateTransactionId } from "../utils/functions.js";

export const createPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { caseId, serviceProviderId, agentId, amount } = req.body;
    if (!agentId) {
      throw new Error("Kindly assign agent to initiate payment");
    }
    const caseData = await Case.findById(caseId).session(session);
    if (!caseData) {
      throw new Error("Case not found");
    }
    if (caseData.status === "Paid") {
      throw new Error("This case is already paid");
    }

    const transactionId = generateTransactionId();
    const date = new Date();
    const payment = await Payment.create(
      [
        {
          caseId,
          serviceProviderId,
          agentId,
          amount,
          transactionId,
          paymentDate: date.toISOString(),
          status: "Completed",
          remarks: "Payment done",
        },
      ],
      { session }
    );
    // Update case status
    await Case.findByIdAndUpdate(
      caseId,
      { status: "Paid", paymentId: payment[0]._id },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Payment created & case updated successfully",
      data: payment[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction error:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message || "Payment creation failed",
    });
  }
};
