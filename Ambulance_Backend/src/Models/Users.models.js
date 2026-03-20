import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role:{
      type:String,
      enum:["Admin","Driver","User"],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    trustScore: {
      type: Number,
      required: true,
      default: 50,
    },
    noShow: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    lastLoginAt:{
      type:Date,
    },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
