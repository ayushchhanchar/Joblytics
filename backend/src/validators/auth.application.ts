import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const addApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job position is required"),
  jobUrl: z.string().url("Invalid job URL"),
  location: z.string().min(1, "Location is required"),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.APPLIED).optional(), 
  appliedAt:  z
    .preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : undefined,
      z.date().optional()
    ),
});

export type AddApplicationInput = z.infer<typeof addApplicationSchema>;