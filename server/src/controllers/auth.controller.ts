import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel";

import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SECRET as string;

export async function signup(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      res.status(400).json({ msg: "User already exists. Kindly login!" });
      return;
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      email,
      password: hashedPass,
    });

    if (newUser) {
      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        SECRET
      );
      res.status(201).json({ msg: "Account created", token });
      return;
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ msg: "Something went wrong!" });
    return;
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const userExists = await userModel.findOne({ email });

    if (!userExists) {
      res.status(400).json({ msg: "User doesn't exists. Kindly create one!" });
      return;
    }

    const validPass = await bcrypt.compare(password, userExists.password);
    if (validPass) {
      const token = jwt.sign(
        { userId: userExists._id, email: userExists.email },
        SECRET
      );
      res.status(200).json({ msg: "Credentials verified", token });
      return;
    }

    res.status(400).json({ msg: "Credentials incorrect" });
    return;
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ msg: "Something went wrong!" });
    return;
  }
}
