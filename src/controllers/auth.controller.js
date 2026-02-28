import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
});

const logoutUser = asyncHandler(async (req, res) => {});

export { registerUser, loginUser, logoutUser };
