import ServiceProvider from "../models/ServiceProvider.model.js";

async function registerServiceProvider(req, res) {
  try {
    const {
      name,
      mobile,
      pan,
      gstin,
      email,
      bankInfo,
      slaTerms,
      tdsApplicable,
      tdsPercentage,
    } = req.body;

    if (
      !name ||
      !mobile ||
      !pan ||
      !gstin ||
      !email ||
      !bankInfo ||
      !slaTerms ||
      tdsApplicable === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are missing",
      });
    }

    const createServiceProvider = await ServiceProvider.create({
      name,
      mobile,
      pan,
      gstin,
      email,
      bankInfo,
      slaTerms,
      tdsApplicable,
      tdsPercentage,
    });
    res.status(201).json({
      success: true,
      message: "Service provider registered successfully",
      data: createServiceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to register service provider",
      error: error.message,
    });
  }
}

async function getAllServiceProviders(req, res) {
  try {
    const fetchServiceProviders = await ServiceProvider.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Service providers fetched successfully",
      data: fetchServiceProviders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get service providers",
      error: error.message,
    });
  }
}

async function getServiceProviderById(req, res) {
  try {
    const { id } = req.params;
    const fetchServiceProviderById = await ServiceProvider.findById(id);
    if (!fetchServiceProviderById) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Service provider fetched successfully",
      data: fetchServiceProviderById,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get service provider by id",
      error: error.message,
    });
  }
}

async function updateServiceProvider(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      mobile,
      pan,
      gstin,
      email,
      bankInfo,
      slaTerms,
      tdsApplicable,
      tdsPercentage,
    } = req.body;
    const updateServiceProvider = await ServiceProvider.findByIdAndUpdate(
      id,
      {
        name,
        mobile,
        pan,
        gstin,
        email,
        bankInfo,
        slaTerms,
        tdsApplicable,
        tdsPercentage,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Service provider updated successfully",
      data: updateServiceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update service provider",
      error: error.message,
    });
  }
}

async function deleteServiceProvider(req, res) {
  try {
    const { id } = req.params;
    const deleteServiceProvider = await ServiceProvider.findByIdAndDelete(id);
    if (!deleteServiceProvider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Service provider deleted successfully",
      data: deleteServiceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service provider",
      error: error.message,
    });
  }
}
export {
  registerServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  updateServiceProvider,
  deleteServiceProvider,
};
