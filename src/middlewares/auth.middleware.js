import { User } from "../models/user.model.js";
import { Backlist } from "../models/backlist.model.js";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("login to access the token");
    }

    const isBlacklisted = await Backlist.findOne({ token }).lean();

    if (isBlacklisted) {
      throw new UnauthorizedError("Token is blacklisted, please login again");
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifiedToken) {
      throw new NotFoundError("userId not found");
    }

    const user = await User.findById(verifiedToken.userId);

    if (!user) {
      throw new NotFoundError("User doesn't exists");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }
};

export const verifySystemUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("login to access the token");
    }

    const isBlacklisted = await Backlist.findOne({ token }).lean();

    if (isBlacklisted) {
      throw new UnauthorizedError("Token is blacklisted, please login again");
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifiedToken) {
      throw new NotFoundError("userId not found");
    }

    const user = await User.findById(verifiedToken.userId).select(
      "+systemUser",
    );

    if (!user.systemUser) {
      throw new ForbiddenError("Unauthorized accesss");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }
};
