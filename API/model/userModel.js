import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email:{type:String,  require:true},
    password:{type:String,  require:true},
    createdAT:{type:Date,default:Date.now}
})
export const User = mongoose.model('User',userSchema)