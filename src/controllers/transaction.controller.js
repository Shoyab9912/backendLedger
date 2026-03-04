import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {
    ConflictError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError
} from "../utils/errors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sendTransactionEmail, sendTransactionFailedEmail } from "../utils/nodeMailer.js";
import { Account } from "../models/account.model.js";
import { Transaction } from "../models/transaction.model.js";
import { ApiError } from "../utils/apiError.js";
import { act } from "react";

const createTransaction = asyncHandler(async (req, res) => {
    const { fromAccount, toAccount, amount, idempotencykey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencykey) {
        throw new BadRequestError("All fields are required")
    }

    const fromUser = await Account.findOne({
        userId: fromAccount
    })


    const toUser = await Account.findOne({
        userId: toAccount
    })


    if (!fromUser || !toUser) {
        throw new NotFoundError("account not exists")
    }

    const isExistIdempotencyKey = await Transaction({
        idempotencykey
    })

    if (isExistIdempotencyKey) {
        if (isExistIdempotencyKey.status === "PENDING") {
            return res.status(200).json(new ApiResponse(200, "Transaction is pending"));
        } else if (isExistIdempotencyKey.status === "COMPLETE") {
            return res.status(200).json(new ApiResponse(200, "Transaction is completed"));
        } else if (isExistIdempotencyKey.status === "FAILED") {
            throw new BadRequestError("Transaction failed");
        } else if (isExistIdempotencyKey.status === "REVERSED") {
            return res.status(200).json(new ApiResponse(200, "Transaction reversed"));
        }
    }


    if (fromUser.status !== "ACTIVE" || toUser.status !== "ACTIVE") {
        throw new BadRequestError("Both accounts must be active for transaction")
    }


    const balance = await fromUser.calculateBalance()

    if (balance < amount) {
        throw new BadRequestError("Insufficient balance in from account")
    }

    const session = await Transaction.startSession()
    session.startTransaction()


    try {
        const transaction = await Transaction.create({
            fromAccount: fromUser._id,
            toAccount: toUser._id,
            status: "PENDING",
            amount,
            idempotencyKey: idempotencykey
        }, { session })

        const creditLedgerEntry = await Ledger.create({
            accountId: toUser._id,
            type: "CREDIT",
            amount,
            transactionId: transaction._id
        }, { session })

        const DebitLedgerEntry = await Ledger.create({
            accountId: fromUser._id,
            type: "DEBIT",
            amount,
            transactionId: transaction._id
        }, { session })

        transaction.status  =  "COMPLETE"
        
        await transaction.save({session})
  
        await session.commitTransaction()
        await sendTransactionEmail(fromUser.email,amount,toUser._id)
        return res.status(201).json(new ApiResponse(201, "Transaction successful", transaction))
    } catch (error) {
        session.endSession()
       await session.abortTransaction()
       await sendTransactionFailedEmail(fromUser.userId,email,amount,fromUser._id)
       throw new ApiError(500,"Transaction failed: " + error.message)
    }



})


export {
    createTransaction
}