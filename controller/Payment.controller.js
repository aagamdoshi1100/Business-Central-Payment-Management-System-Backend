import mongoose from "mongoose";
import Case from "../models/Case.model.js";
import { Payment } from "../models/Payment.model.js";
import { generateTransactionId } from "../utils/functions.js";
import ServiceProvider from "../models/ServiceProvider.model.js";

export const createPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      caseId,
      serviceProviderId,
      agentId,
      NetAmount,
      baseAmount,
      GSTAmount,
      TDSAmount,
      TradeDiscountAmount,
      convenienceCharges,
      SLAType,
      SLAAmountValue,
    } = req.body;
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
          NetAmount,
          transactionId,
          paymentDate: date.toISOString(),
          status: "Completed",
          remarks: "Payment has been paid",
          baseAmount,
          GSTAmount,
          TDSAmount,
          TradeDiscountAmount,
          convenienceCharges,
          SLAType,
          SLAAmountValue,
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
          status: { $in: ["In progress", "Open", "Paid"] },
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

export const generateReport = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.body;
    let query = {};
    if (status === "All") {
      query = {
        paymentDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      query = {
        status: status,
        paymentDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }
    const reports = await Payment.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "cases",
          localField: "caseId",
          foreignField: "_id",
          as: "caseDetails",
        },
      },
      {
        $lookup: {
          from: "serviceproviders",
          localField: "serviceProviderId",
          foreignField: "_id",
          as: "serviceProviderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "agentId",
          foreignField: "_id",
          as: "agentDetails",
        },
      },
      {
        $unwind: {
          path: "$caseDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$serviceProviderDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$agentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          transactionId: 1,
          amount: 1,
          paymentDate: 1,
          status: 1,
          remarks: 1,
          caseNumber: "$caseDetails.caseNumber",
          serviceProviderName: "$serviceProviderDetails.name",
          agentName: "$agentDetails.name",
          createdAt: 1,
        },
      },
      {
        $sort: {
          paymentDate: -1,
        },
      },
    ]);
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getTransactionDetailsByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!caseId) {
      return res.status(400).json({
        success: false,
        message: "Case ID is required",
      });
    }

    const paymentDetails = await Payment.aggregate([
      {
        $match: {
          caseId: new mongoose.Types.ObjectId(caseId),
        },
      },
      {
        $lookup: {
          from: "cases",
          localField: "caseId",
          foreignField: "_id",
          as: "caseDetails",
        },
      },
      {
        $lookup: {
          from: "serviceproviders",
          localField: "serviceProviderId",
          foreignField: "_id",
          as: "serviceProviderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "agentId",
          foreignField: "_id",
          as: "agentDetails",
        },
      },
      {
        $unwind: {
          path: "$caseDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$serviceProviderDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$agentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          NetAmount: 1,
          baseAmount: 1,
          GSTAmount: 1,
          TDSAmount: 1,
          TradeDiscountAmount: 1,
          convenienceCharges: 1,
          SLAType: 1,
          SLAAmountValue: 1,
          transactionId: 1,
          paymentDate: 1,
          status: 1,
          remarks: 1,
          createdAt: 1,
          updatedAt: 1,
          caseNumber: "$caseDetails.caseNumber",
          caseStatus: "$caseDetails.status",
          serviceProviderName: "$serviceProviderDetails.name",
          serviceProviderEmail: "$serviceProviderDetails.email",
          serviceProviderPhone: "$serviceProviderDetails.phone",
          agentName: "$agentDetails.name",
          agentEmail: "$agentDetails.email",
        },
      },
      {
        $sort: {
          paymentDate: -1,
        },
      },
    ]);

    if (!paymentDetails || paymentDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payment details found for this case",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment details retrieved successfully",
      data: paymentDetails,
    });
  } catch (error) {
    console.error("Failed to fetch payment details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
};
