import BulkLog from "../models/BulkLog.model.js";
import UserLog from "../models/UserLog.model.js";

export const fetchLogsBypage = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const [logs, totalLogs] = await Promise.all([
      UserLog.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            userId: "$user._id",
            name: "$user.name",
            accessType: "$user.accessType",
            action: 1,
            ipAddress: 1,
            created: "$createdAt",
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: options?.page * options?.limit },
        { $limit: options?.limit },
      ]),
      UserLog.countDocuments(),
    ]);
    return res.status(200).json({
      result: true,
      message: "Fetched logs",
      logs,
      totalLogs,
    });
  } catch (error) {
    console.error("Fetch logs error:", error);
    res.status(500).json({ message: "Logs fetching error" });
  }
};

export const fetchBulkLogsBypage = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const [bulkLogs, totalBulkLogs] = await Promise.all([
      BulkLog.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            userId: "$user._id",
            name: "$user.name",
            accessType: "$user.accessType",
            duplicates: 1,
            validCases: 1,
            invalidCases: 1,
            created: "$createdAt",
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: options?.page * options?.limit },
        { $limit: options?.limit },
      ]),
      BulkLog.countDocuments(),
    ]);
    return res.status(200).json({
      result: true,
      message: "Fetched logs",
      bulkLogs,
      totalBulkLogs,
    });
  } catch (error) {
    console.error("Fetch logs error:", error);
    res.status(500).json({ message: "Logs fetching error" });
  }
};
