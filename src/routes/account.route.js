import express from "express";
import { createUserAccount } from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/", createUserAccount);

export default router;
