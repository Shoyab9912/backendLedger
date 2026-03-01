import express from "express";

const router = express.Router();

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
