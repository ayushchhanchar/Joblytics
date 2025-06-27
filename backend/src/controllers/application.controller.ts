import { Request, Response } from "express";
import { addApplicationSchema } from "../validators/auth.application";
import { Client } from "../conifg/prisma";
import { ApplicationStatus } from "@prisma/client";

export const addApplication = async (req: Request & { user?: any }, res: Response) => {
  const parsed = addApplicationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const { company, role, jobUrl, location, status, appliedAt } = parsed.data;

  try {
    const application = await Client.application.create({
      data: {
        userId: req.user.userId,
        company,
        role,
        jobUrl,
        location,
        status:ApplicationStatus.APPLIED, 
        appliedAt: appliedAt || new Date(),
      },
    });

    return res.status(201).json({ application });
  } catch (err) {
    return res.status(500).json({ error: "Could not create application" });
  }
};