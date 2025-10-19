import Case from "../models/Case.model.js";

const createCase = async (req, res) => {
  try {
    const {
      serviceProviderName,
      workReferenceId,
      description,
      dueDate,
      amount,
    } = req.body;

    const countCases = await Case.countDocuments();
    let caseNumber = "CASE-";
    if (countCases < 10000000) {
      for (let i = 0; i < 8 - countCases.toString.length; i++) {
        caseNumber += "0";
      }
      caseNumber += countCases + 1;
    } else {
      caseNumber += countCases + 1;
    }

    const newCase = await Case.create({
      caseNumber,
      serviceProviderName,
      workReferenceId,
      description,
      dueDate,
      amount,
    });
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
    const cases = await Case.find();
    res.status(200).json({
      success: true,
      message: "Cases fetched successfully",
      cases,
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

const updateCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { caseNumber, vendor, assignedTo, amount, dueDate, status, notes } =
      req.body;
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { caseNumber, vendor, assignedTo, amount, dueDate, status, notes },
      { new: true }
    );
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

export { createCase, getAllCases, getCaseById, updateCaseById, validateWorkId };
