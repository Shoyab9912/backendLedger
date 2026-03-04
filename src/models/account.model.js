import mongoose, { Schema } from "mongoose";
import { Ledger } from "./ledger.model.js";
const accountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId required"],
      index: true,
    },
    currency: {
      type: "String",
      required: [true, "currency required"],
      default: "INR",
    },
    status: {
      type: "String",
      enum: {
        values: ["Active", "Closed", "Frozen"],
        message: "account status can be either active or frozen or closed",
      },
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ userId: 1, status: 1 });


accountSchema.methods.calculateBalance = async function () {
  try {
    const balance = await Ledger.aggregate([
      { $match : { accountId: this._id } },
      {
        $group : {
          _id : null,
          CreditBalance : {
            $sum : {
              $cond : [{$eq : ["$type","CREDIT"]},"$amount",0]
            }
          },
          DebitBalance : {
            $sum : {
              $cond : [{$eq : ["$type","DEBIT"]},"$amount",0]
            }
          }
        }
      },{
        $project : {
          _id : 0,
          balance : {
            $subtract : ["$CreditBalance","$DebitBalance"]
          }
        }
      }
    ])

    return balance.length > 0 ? balance[0].balance : 0;

  } catch (error) {
    throw new Error("Error calculating balance: " + error.message);
  }
}

export const Account = mongoose.model("Account", accountSchema);
