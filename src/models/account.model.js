import mongoose,{Schema} from "mongoose"


const accountSchema = new Schema({
  userId: {
    type:Schema.Types.ObjectId,
    ref:"User",
    required:[true,"userId required"],
    index:true
  },
  currency: {
    type:"String",
    required:[true,"currency required"],
    default:"INR"
  },
  status: {
    type:"String",
    enum:["Active","Frozen","Closed"],
    default:"Active"
  },
},{
    timestamps:true
})


accountSchema.index({userId:1,status:1})

export const Account = mongoose.model("Account",accountSchema)