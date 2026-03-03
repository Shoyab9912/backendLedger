import express from "express";
import { createUserAccount } from "../controllers/account.controller.js";
const router = express.Router();

router.route("/", createUserAccount);

export default router;
