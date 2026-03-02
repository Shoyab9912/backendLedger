import { Account } from "../models/account.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const  createUserAccount = asyncHandler(async (requestAnimationFrame,res) => {
    const  createAccount = await Account.create({
        user:req.user._id
    })
   return res.status(201).json(new ApiResponse(201,"account created successfull",createAccount))
})

export {
    createUserAccount
}