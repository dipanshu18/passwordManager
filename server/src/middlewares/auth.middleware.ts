import { type Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SECRET as string;

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ msg: "Unauthorized" });
    return;
  }

  const decoded = jwt.verify(JSON.parse(token), SECRET) as JwtPayload;

  if (!decoded) {
    res.status(401).json({ msg: "Invalid token" });
    return;
  }

  req.body.user = { userId: decoded.userId, email: decoded.email };
  next();
}
