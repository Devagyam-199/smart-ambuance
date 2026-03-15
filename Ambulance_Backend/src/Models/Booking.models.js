import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "En-Route",
        "Arrived",
        "Completed",
        "Cancelled",
      ],
      required: true,
      default: "Pending",
    },
  },
  { timestamps: true },
);
bookingSchema.index({ location: "2dsphere" });
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
