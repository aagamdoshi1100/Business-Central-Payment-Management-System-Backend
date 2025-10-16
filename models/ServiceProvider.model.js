import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    PAN: {
      type: String,
      required: true,
    },
    GSTIN: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bankInfo: {
      accountNumber: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
    },
    SLATerms: {
      dueDays: {
        type: Number,
        required: true,
      },
      penaltyRate: {
        type: Number,
        required: true,
      },
      incentiveRate: {
        type: Number,
        required: true,
      },
    },
    tdsApplicable: {
      type: Boolean,
      required: true,
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
