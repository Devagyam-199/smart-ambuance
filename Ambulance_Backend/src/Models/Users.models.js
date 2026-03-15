import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    firebaseUid:{
      type:String,
      unique:true,
      sparse:true,
    }
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
