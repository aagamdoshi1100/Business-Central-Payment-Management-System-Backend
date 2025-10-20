import { z } from "zod";

export const paymentSchema = z.object({
  caseId: z.string().min(1, "Case ID required"),
  serviceProviderId: z.string().min(1, "Service Provider ID required"),
  agentId: z.string().min(1, "Agent ID required"),

  amount: z.number().positive(),
  //   penaltyValue: z.number().min(0).default(0),
  //   incentiveValue: z.number().min(0).default(0),
  //   tradeDiscountValue: z.number().min(0).default(0),
  //   convenienceChargeValue: z.number().min(0).default(0),
  //   tdsValue: z.number().min(0).default(0),

  paymentMode: z.enum(["UPI", "NEFT", "IMPS", "Cheque"]),
  transactionId: z.string().min(3, "Transaction ID required"),
  paymentDate: z.coerce.date(),
  status: z.enum(["Pending", "Completed", "Failed"]).default("Pending"),
  remarks: z.string().optional(),
});
