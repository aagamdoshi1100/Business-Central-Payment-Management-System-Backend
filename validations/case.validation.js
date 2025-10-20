import { z } from "zod";

const workReferenceIdPattern = /^WORK-\d{3,}$/;

export const caseValidationSchema = z.object({
  serviceProvider: z
    .string()
    .min(3, "Service Provider Name must be at least 3 characters")
    .max(100, "Service Provider Name must not exceed 100 characters")
    .trim(),

  workReferenceId: z
    .string()
    .regex(
      workReferenceIdPattern,
      "Please enter a valid Work Reference ID (e.g., WORK-001)"
    )
    .transform((val) => val.toUpperCase()),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .trim(),

  amount: z
    .number()
    .min(0, "Amount must be non-negative")
    .max(10000000, "Amount must not exceed 10,000,000"),

  dueDate: z
    .string()
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: "Due date must be today or in the future",
      }
    )
    .transform((val) => new Date(val)),
});
