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

export const getApplication = async (req: Request & { user?: any }, res: Response) => {

  try {
     const userId = req.user?.userId;
    const applications = await Client.application.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
res.send(applications);
  } catch (err) {
  res.status(500).send().json({ error: "Could not fetch applications" });
  }
}

export const updateApplicationStatus=async(req:Request & {user?:any},res:Response)=>{

const { id } = req.params;
  const { status } = req.body;
  console.log("ststus-----",status);
  console.log("id-----",id);

  try {
    const updated = await Client.application.update({
      where: { id },
      data: { status: status as ApplicationStatus },
    });

    res.json({ application: updated });
  } catch (err) {
    console.error("error--------------",err);
    res.status(500).json({ error: "Could not update application status" });
  }
};