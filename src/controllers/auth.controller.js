import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {
  ConflictError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {sendRegistrationEmail} from "../utils/nodeMailer.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((f) => !f || f.trim() === "")) {
    throw new ValidationError("All fields are required");
  }

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new ConflictError("User already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
  });

  await sendRegistrationEmail(user.email, user.name);
  return res
    .status(201)
    .json(new ApiResponse(201, "successfully user registered", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("All Fields are required");
  }

  const user = await User.findOne({ email }).select("+password").orFail();
  // console.log(user)

  if (!user) {
    throw new NotFoundError("User Not exists");
  }

  const isValidPassword = await user.verifyPassword(password);

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid Credientials");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5d",
    },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User login SuccessFull"), token);
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json(new ApiResponse(200, "logout SuccessFull"));
});

export { registerUser, loginUser, logoutUser };
