import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    fromAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Transaction must be associated with from account"],
      index: true,
    },
    toAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Transaction must be associated with to account"],
      index: true,
    },
    amount: {
      type: "Number",
      required: [true, "amount must be required in transaction"],
      min: [0, "Amount is required for creating transaction "],
    },
    status: {
      type: "String",
      enum: {
        values: ["PENDING", "COMPLETE", "FAILED", "REVERSED"],
        message: "status must be pending,complete ,failed or reversed",
      },
      default: "PENDING",
    },
    idempotencyKey: {
      type: "String",
      required: [true, "Idempotency key is required for transaction"],
      unique: true,
    },
  },
  { timestamps: true },
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
