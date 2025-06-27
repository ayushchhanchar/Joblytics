import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
    console.log("token------",token);
  if (!token ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

 
  console.log(process.env.JWT_SECRET);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("payload....",payload);
    req.user = payload; 
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};