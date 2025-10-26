import Case from "../models/Case.model.js";
import { nanoid, customAlphabet } from "nanoid";
import { caseValidationSchema } from "../validations/case.validation.js";

const nanoidCustom = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 12);

const createCase = async (req, res) => {
  try {
    const { serviceProvider, workReferenceId, description, dueDate, amount } =
      req.body;
    const existingWorkId = await Case.findOne({ workReferenceId });
    if (existingWorkId) {
      res.status(200).json({
        success: true,
        message: `Case has been already created with the workId ${workReferenceId}`,
        existingWorkId,
      });
    }
    const caseNumber = `CASE-${nanoidCustom()}`;
    const createdCase = await Case.create({
      caseNumber: caseNumber,
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

const createBulkCases = async (req, res) => {
  let resData = [];
  let duplicates = [];
  const validCases = [];
  const invalidCases = [];

  const generateCases = req.body.map((work) => {
    const caseNumber = `CASE-${nanoidCustom()}`;
    const dueDate = new Date(work.dueDate);
    const amount = parseFloat(work.amount);
    return {
      caseNumber,
      dueDate,
      amount,
      ...work,
    };
  });

  generateCases.forEach((data, index) => {
    const parsed = caseValidationSchema.safeParse(data);
    if (parsed.success) {
      validCases.push({
        caseNumber: `CASE-${nanoid(10).toUpperCase()}`,
        ...parsed.data,
      });
    } else {
      invalidCases.push({
        workid: data.workReferenceId,
        errors: parsed.error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
  });

  if (validCases.length === 0) {
    return res.status(400).json({
      result: false,
      message: "All records invalid. Nothing inserted.",
      invalidCases,
    });
  }

  try {
    const insertedDocs = await Case.insertMany(validCases, {
      ordered: false,
    });
    return res.status(201).json({
      insertedDocs,
      message:
        invalidCases.length > 0
          ? `${insertedDocs.length} cases inserted. \n${invalidCases.length} invalid data entries.`
          : `${insertedDocs.length} cases inserted.`,
      invalidCases,
    });
  } catch (error) {
    console.error(error);
    error?.results?.map((data) => {
      if (data?.caseNumber) {
        resData.push(data);
      } else {
        duplicates.push(data.err.op.workReferenceId);
      }
    });
    return res.status(200).json({
      insertedDocs: resData,
      duplicates,
      invalidCases,
      message:
        invalidCases.length > 0
          ? `${resData.length} cases inserted. \n${duplicates.length} duplicates skipped. \n${invalidCases.length} invalid data entries.`
          : `${resData.length} cases inserted. \n${duplicates.length} duplicates skipped.`,
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
  createBulkCases,
  getAllCases,
  getCaseById,
  updateCaseByCaseNumber,
  validateWorkId,
};
