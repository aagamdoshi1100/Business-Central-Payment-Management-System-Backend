import ServiceProvider from "../models/ServiceProvider.model.js";

async function registerServiceProvider(req, res) {
  try {
    const {
      name,
      PAN,
      GSTIN,
      contactNumber,
      email,
      bankInfo,
      SLATerms,
      tdsApplicable,
    } = req.body;

    if (
      !name ||
      !PAN ||
      !GSTIN ||
      !contactNumber ||
      !email ||
      !bankInfo ||
      !SLATerms ||
      !tdsApplicable
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const createServiceProvider = await ServiceProvider.create({
      name,
      PAN,
      GSTIN,
      contactNumber,
      email,
      bankInfo,
      SLATerms,
      tdsApplicable,
    });
    res.status(201).json({
      success: true,
      message: "Service provider registered successfully",
      createServiceProvider,
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

async function getServiceProvider(req, res) {
  try {
    const fetchServiceProviders = await ServiceProvider.find({});
    res.status(200).json({
      success: true,
      message: "Service providers fetched successfully",
      fetchServiceProviders,
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
    res.status(200).json({
      success: true,
      message: "Service provider fetched successfully",
      fetchServiceProviderById,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get service provider by id",
    });
  }
}

async function updateServiceProvider(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      PAN,
      GSTIN,
      contactNumber,
      email,
      bankInfo,
      SLATerms,
      tdsApplicable,
    } = req.body;
    const updateServiceProvider = await ServiceProvider.findByIdAndUpdate(
      id,
      {
        name,
        PAN,
        GSTIN,
        contactNumber,
        email,
        bankInfo,
        SLATerms,
        tdsApplicable,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Service provider updated successfully",
      updateServiceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update service provider",
    });
  }
}

async function deleteServiceProvider(req, res) {
  try {
    const { id } = req.params;
    const deleteServiceProvider = await ServiceProvider.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Service provider deleted successfully",
      deleteServiceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service provider",
    });
  }
}
export {
  registerServiceProvider,
  getServiceProvider,
  getServiceProviderById,
  updateServiceProvider,
  deleteServiceProvider,
};
