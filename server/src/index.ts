import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";

const SECRET = crypto.createHash("sha256").update("supersecret123@#").digest(); // 32 bytes

function encryptPass(password: string) {
  const iv = crypto.randomBytes(12); // IV should be 12 bytes for AES-256-CCM

  const cipher = crypto.createCipheriv("aes-256-ccm", SECRET, iv, {
    authTagLength: 16, // CCM mode requires authTagLength
  });

  const encrypted = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag(); // CCM mode requires this

  return {
    iv: iv.toString("hex"),
    encryptedPass: encrypted.toString("hex"),
    authTag: authTag.toString("hex"), // return authTag for decryption
  };
}

function decryptPass(encrypted: {
  iv: string;
  password: string;
  authTag: string;
}) {
  const decipher = crypto.createDecipheriv(
    "aes-256-ccm",
    SECRET,
    Buffer.from(encrypted.iv, "hex"),
    {
      authTagLength: 16,
    }
  );

  decipher.setAuthTag(Buffer.from(encrypted.authTag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.password, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
}

const app = express();

app.use(cors());
app.use(express.json());

const userPassword = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  authTag: {
    type: String,
    required: true,
  },
});

const passwordModel = mongoose.model("Password", userPassword);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
});

app.get("/passwords", async (req: Request, res: Response) => {
  const passwords = await passwordModel.find({}, { title: 1, password: 1 });

  if (passwords.length < 1) {
    return res.status(404).json({ msg: "No password added fetched!" });
  }

  return res.status(200).json({ passwords });
});

app.get("/passwords/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const passwordExists = await passwordModel.findById(id);

  if (!passwordExists) {
    return res.status(404).json({ msg: "Password doesn't exists!" });
  }

  const encrypted = {
    iv: passwordExists.iv!,
    password: passwordExists.password,
    authTag: passwordExists.authTag,
  };
  const password = decryptPass(encrypted);

  return res.status(200).json({ password });
});

app.post("/passwords", async (req: Request, res: Response) => {
  const { title, password } = req.body;

  const { iv, encryptedPass, authTag } = encryptPass(password);

  await passwordModel.create({
    title,
    iv,
    password: encryptedPass,
    authTag,
  });

  return res.status(201).json({ msg: "Password added!" });
});

app.listen(8080, async () => {
  await mongoose.connect("mongodb://localhost:27017/passwordMgm");
  console.log("DB connected...");

  console.log("Server listening on port 8080...");
});
