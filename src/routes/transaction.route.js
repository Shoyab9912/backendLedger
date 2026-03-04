import express from "express";
import {
  createTransaction,
  createInitalFunds,
} from "../controllers/transaction.controller.js";
import { verifyJWT, verifySystemUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", verifyJWT, createTransaction);
router.post("/initial-funds", verifySystemUser, createInitalFunds);

export default router;
