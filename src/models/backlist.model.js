import mongoose,{Scema} from "mongoose";


const backlistSchema = new Scema({
    token:{
        type:"String",
        required:[true,"token is required for blacklisting"],
        unique:true,
    },

},{timestamps:true})

backlistSchema.index({createdAt:1},{expireAfterSeconds:60*60*24*3}) // expire after 3 days

export const Backlist = mongoose.model("Backlist",backlistSchema)