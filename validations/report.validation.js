// validations/payment.validation.js
import { z } from "zod";

export const reportFilterSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["All", "Completed", "Pending", "Failed"]),
});
