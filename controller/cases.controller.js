import Case from "../models/Case.model.js";

const createCase = async (req, res) => {
  try {
    const { serviceProvider, workReferenceId, description, dueDate, amount } =
      req.body;
    const countCases = await Case.countDocuments();
    let caseNumber = "CASE-";
    if (countCases < 10000000) {
      for (let i = 0; i < 8 - countCases.toString().length; i++) {
        caseNumber += "0";
      }
      caseNumber += countCases + 1;
    } else {
      caseNumber += countCases + 1;
    }

    const createdCase = await Case.create({
      caseNumber,
      serviceProvider,
      workReferenceId,
      description,
      dueDate,
      amount,
    });

    const newCase = await Case.findById(createdCase._id).populate(
      "serviceProvider",
      "_id name"
    );

    res.status(201).json({
      success: true,
      message: "Case created successfully",
      newCase,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create case",
      error: error.message,
    });
  }
};

const getAllCases = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const cases = await Case.find({})
      .limit(options?.limit * 1)
      .skip(options?.page * options?.limit)
      .sort(options?.sort)
      .populate("serviceProvider", "name _id")
      .populate("assignedTo", "name _id");

    const totalCases = await Case.countDocuments();

    res.status(200).json({
      success: true,
      message: "Cases fetched successfully",
      cases,
      totalCases,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get cases",
      error: error.message,
    });
  }
};

const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const caseById = await Case.findById(id);
    res.status(200).json({
      success: true,
      message: "Case fetched successfully",
      caseById,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get case by id",
      error: error.message,
    });
  }
};

const updateCaseByCaseNumber = async (req, res) => {
  try {
    const { caseNumber } = req.params;
    const { assignedTo } = req.body;
    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Failed to assign agent",
      });
    }
    const updatedCase = await Case.findOneAndUpdate(
      { caseNumber },
      { assignedTo, status: "In progress" },
      { new: true }
    );
    if (!updatedCase) {
      res.status(500).json({
        success: false,
        message: "Failed to update case",
      });
    }
    res.status(200).json({
      success: true,
      message: "Case updated successfully",
      updatedCase,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update case",
      error: error.message,
    });
  }
};

const validateWorkId = async (req, res) => {
  try {
    const findWorkId = await Case.findOne({
      workReferenceId: req.body.workReference,
    });
    if (!findWorkId) {
      res.status(200).json({
        success: true,
        message: "Work Id not yet submitted",
        findWorkId,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Work Id has been already submitted",
        findWorkId,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to validate Work Id",
      error: error.message,
    });
  }
};

export {
  createCase,
  getAllCases,
  getCaseById,
  updateCaseByCaseNumber,
  validateWorkId,
};
