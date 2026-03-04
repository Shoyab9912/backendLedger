import mongoose, { Schema } from "mongoose";

const ledgerSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "AccountId is required for ledger"],
      index: true,
      immutable: true,
    },
    type: {
      type: "String",
      enum: {
        values: ["Credit", "Debit"],
        message: "Type can be credit or debit",
      },
      immutable: true,
    },
    amount: {
      type: "Number",
      required: [true, "amount is required for ledger"],
      min: 0,
      immurable: true,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      required: [true, "transaction is required"],
      index: true,
      immutable: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

function preventLedgerModified() {
  throw new Error("Ledger can't be modified or deleted");
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModified);
ledgerSchema.pre("updateOne", preventLedgerModified);
ledgerSchema.pre("findOneAndDelete", preventLedgerModified);
ledgerSchema.pre("deleteOne", preventLedgerModified);
ledgerSchema.pre("deleteMany", preventLedgerModified);
ledgerSchema.pre("findOneAndReplace", preventLedgerModified);
ledgerSchema.pre("replaceOne", preventLedgerModified);
ledgerSchema.pre("updateMany", preventLedgerModified);

export const Ledger = mongoose.model("Ledger", ledgerSchema);
