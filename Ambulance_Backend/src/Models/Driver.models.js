import mongoose from "mongoose";
const driverPhotoSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    format: {
      type: String,
    },
    bytes: {
      type: Number,
    },
  },
  { _id: false },
);

const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Driver's License", "Aadhaar Card"],
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    format: {
      type: String,
    },
    bytes: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    rejectedReason: {
      type: String,
    },
  },
  { timestamps: true },
);
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
    email: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      lowercase:true,
    },
    password: {
      type: String,
      select: false,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      enum: ["BLS", "ALS", "Mortuary"],
      default: "BLS",
    },
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default:null,
    },
    driverPhoto: {
      type: driverPhotoSchema,
      default: null,
    },
    documents: [documentSchema],
    accStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Suspended"],
      default: "Pending",
    },

    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
driverSchema.index({ location: "2dsphere" });
driverSchema.index({ phoneNumber: 1 });
driverSchema.index({ accStatus: 1 });
const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
