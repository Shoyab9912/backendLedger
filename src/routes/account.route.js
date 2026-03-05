import express from "express";
import { createUserAccount,getUserAccounts,getUserAccountBalance} from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route('/').post(createUserAccount).get(getUserAccounts);
router.route('/:accountId/balance').get(getUserAccountBalance);

export default router;
