import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    // Basic Details
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    pan: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    // Banking Information
    bankInfo: {
      bankName: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
      },
    },

    // SLA Terms & Conditions
    slaTerms: {
      slaType: {
        type: String,
        required: true,
        default: "Time Based",
      },
      penaltyType: {
        type: String,
        required: true,
      },
      penaltyValue: {
        type: Number,
        required: true,
      },
      incentiveType: {
        type: String,
        required: true,
      },
      incentiveValue: {
        type: Number,
        required: true,
      },
    },

    // TDS Details
    tdsApplicable: {
      type: Boolean,
      required: true,
      default: false,
    },
    tdsPercentage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);

export default ServiceProvider;
