import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { authRouter } from "./routes/auth.route";
import { passwordRouter } from "./routes/passwords.route";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/passwords", authMiddleware, passwordRouter);

app.listen(8080, async () => {
  await mongoose.connect("mongodb://localhost:27017/passwordMgm");
  console.log("DB connected...");

  console.log("Server listening on port 8080...");
});
