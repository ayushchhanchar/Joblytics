import { registerSchema, signInSchema } from "../validators/auth.schema";
import { hashPassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { Client } from "../conifg/prisma";
import pdfParse from "pdf-parse";
import fs from "fs";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { name, email, password } = parsed.data;

  const existing = await Client.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hashed = await hashPassword(password);

  let resumeUrl: string | undefined = undefined;
  let resumeText: string | undefined = undefined;

  if (req.file) {
    resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const buffer = fs.readFileSync(req.file.path);
    const parsedPdf = await pdfParse(buffer);
    resumeText = parsedPdf.text;
  }
  const user = await Client.user.create({
    data: {
      name,
      email,
      password: hashed,
      resumeUrl,
      resumeText,
    },
  });
  res
    .status(201)
    .json({user: { id: user.id, name: user.name, email: user.email } });

};
export const signIn = async (req: Request, res: Response) => {
  const parsedData = signInSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res
      .status(400)
      .json({ error: parsedData.error.flatten().fieldErrors });
  }
  const { email, password } = parsedData.data;
  const user = await Client.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = signToken(user.id);
  res
    .status(200)
    .json({ token, user: { id: user.id, name: user.name, email: user.email } });
};
