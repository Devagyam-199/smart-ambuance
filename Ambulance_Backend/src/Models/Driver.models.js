import mongoose from "mongoose";
const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    VehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    VehicleType: {
      type: String,
      enum: ["BLS", "ALS", "Mortuary"],
      default: "BLS",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
driverSchema.index({ location: "2dsphere" });
const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
