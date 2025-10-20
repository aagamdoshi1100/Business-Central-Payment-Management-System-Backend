import mongoose from "mongoose";
import Case from "../models/Case.model.js";
import { Payment } from "../models/Payment.model.js";
import { generateTransactionId } from "../utils/functions.js";
import ServiceProvider from "../models/ServiceProvider.model.js";

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

export const getkeyValues = async (req, res) => {
  try {
    const caseStats = await Case.aggregate([
      {
        $match: {
          status: { $in: ["In progress", "open", "Paid"] },
        },
      },
      {
        $group: {
          _id: "$status",
          totalAmount: {
            $sum: "$amount",
          },
          caseCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const serviceProvidersDetails = await Case.aggregate([
      {
        $group: {
          _id: "$serviceProvider",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    const serviceProviderStats = await Promise.all(
      serviceProvidersDetails.map(async (sp) => {
        const providerData = await ServiceProvider.findById(sp._id).select(
          "name"
        );

        return {
          provider: providerData?.name,
          caseCount: sp.count,
          providerId: sp._id,
        };
      })
    );
    return res.status(200).json({
      success: true,
      message: "Data fetch successfully",
      caseStats,
      serviceProviderStats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Data fetch failed",
    });
  }
};
