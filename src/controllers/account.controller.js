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

const getUserAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ userId: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, "successfully fetched user accounts", accounts));
});


const getUserAccountBalance = asyncHandler(async (req, res) => {
  
  const account = await Account.findOne({
    userId: req.user._id,
    _id: req.params.accountId
  }).lean();

  if (!account) {
    throw new NotFoundError("Account not found");
  }

  const balance = await account.calculateBalance();

  return res
    .status(200)
    .json(new ApiResponse(200, "successfully fetched account balance", { balance }));
});

export { createUserAccount, getUserAccounts, getUserAccountBalance };


