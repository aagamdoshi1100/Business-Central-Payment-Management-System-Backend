import { z } from "zod";

// Validation patterns
const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const gstinPattern =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const mobilePattern = /^[6-9]\d{9}$/;
const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Service Provider validation schema
export const serviceProviderValidationSchema = z.object({
  // Basic Details
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  mobile: z
    .string()
    .regex(mobilePattern, "Please enter a valid 10-digit mobile number")
    .length(10, "Mobile number must be exactly 10 digits"),

  pan: z
    .string()
    .regex(panPattern, "Please enter a valid PAN (e.g., ABCDE1234F)")
    .transform((val) => val.toUpperCase()),

  gstin: z
    .string()
    .regex(gstinPattern, "Please enter a valid GSTIN (e.g., 22ABCDE1234F1Z5)")
    .transform((val) => val.toUpperCase()),

  email: z
    .string()
    .email("Please enter a valid email address")
    .regex(emailPattern, "Please enter a valid email address")
    .transform((val) => val.toLowerCase()),

  // Banking Information
  bankInfo: z.object({
    bankName: z
      .string()
      .min(2, "Bank name must be at least 2 characters")
      .max(100, "Bank name must not exceed 100 characters")
      .trim(),

    ifscCode: z
      .string()
      .regex(ifscPattern, "Please enter a valid IFSC Code (e.g., SBIN0001234)")
      .transform((val) => val.toUpperCase()),

    accountNumber: z
      .string()
      .regex(/^\d{9,18}$/, "Account number must be 9-18 digits")
      .min(9, "Account number must be at least 9 digits")
      .max(18, "Account number must not exceed 18 digits"),
  }),

  // SLA Terms & Conditions
  slaTerms: z.object({
    slaType: z
      .string()
      .enum(["Time Based"], "Invalid SLA type")
      .default("Time Based"),

    penaltyType: z
      .string()
      .enum(["Fixed", "Percentage"], "Invalid penalty type"),

    penaltyValue: z
      .number()
      .min(0, "Penalty value must be non-negative")
      .max(1000000, "Penalty value must not exceed 1,000,000"),

    incentiveType: z
      .string()
      .enum(["Fixed", "Percentage"], "Invalid incentive type"),

    incentiveValue: z
      .number()
      .min(0, "Incentive value must be non-negative")
      .max(1000000, "Incentive value must not exceed 1,000,000"),
  }),

  // TDS Details
  tdsApplicable: z.boolean().default(false),

  tdsPercentage: z
    .number()
    .min(0, "TDS percentage must be non-negative")
    .max(100, "TDS percentage must not exceed 100")
    .optional()
    .refine(
      (val, ctx) => {
        const tdsApplicable = ctx.parent?.tdsApplicable;
        if (tdsApplicable === true) {
          return val !== undefined && val !== null;
        }
        return true;
      },
      {
        message: "TDS percentage is required when TDS is applicable",
      }
    ),

  // Status fields (optional for creation)
  status: z
    .enum(["pending", "approved", "rejected"])
    .default("pending")
    .optional(),

  isActive: z.boolean().default(true).optional(),
});
