import crypto from "crypto";
import { type Request, Response } from "express";
import { passwordModel } from "../models/passwordModel";

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

export async function getPasswords(req: Request, res: Response) {
  const { userId } = req.body.user;
  const passwords = await passwordModel.find(
    { userId },
    { title: 1, password: 1 }
  );

  if (passwords.length < 1) {
    res.status(404).json({ msg: "No password added fetched!" });
    return;
  }

  res.status(200).json({ passwords });
  return;
}

export async function decryptPassword(req: Request, res: Response) {
  const { id } = req.params;

  const passwordExists = await passwordModel.findById(id);

  if (!passwordExists) {
    res.status(404).json({ msg: "Password doesn't exists!" });
    return;
  }

  const encrypted = {
    iv: passwordExists.iv!,
    password: passwordExists.password,
    authTag: passwordExists.authTag,
  };
  const password = decryptPass(encrypted);

  res.status(200).json({ password });
  return;
}

export async function addPassword(req: Request, res: Response) {
  const { userId } = req.body.user;
  const { title, password } = req.body;

  const { iv, encryptedPass, authTag } = encryptPass(password);

  await passwordModel.create({
    title,
    iv,
    password: encryptedPass,
    authTag,
    userId,
  });

  res.status(201).json({ msg: "Password added!" });
  return;
}

export async function deletePassword(req: Request, res: Response) {
  const { id } = req.params;

  await passwordModel.findByIdAndDelete(id);

  res.status(200).json({ msg: "Password deleted!" });
  return;
}
