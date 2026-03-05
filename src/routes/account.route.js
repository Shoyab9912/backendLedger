import express from "express";
import { createUserAccount,getUserAccounts } from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route('/').post(createUserAccount).get(getUserAccounts);

export default router;
