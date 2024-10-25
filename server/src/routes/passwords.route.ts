import express from "express";
import {
  addPassword,
  decryptPassword,
  deletePassword,
  getPasswords,
} from "../controllers/passwords.controller";

const passwordRouter = express.Router();

passwordRouter.get("/", getPasswords);

passwordRouter.get("/:id", decryptPassword);

passwordRouter.post("/", addPassword);

passwordRouter.delete("/:id", deletePassword);

export { passwordRouter };
