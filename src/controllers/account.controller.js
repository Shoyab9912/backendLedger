import { Account } from "../models/account.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createUserAccount = asyncHandler(async (req, res) => {
  
  const createAccount = await Account.create({
    userId: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "account created successfull", createAccount));
});

export { createUserAccount };
