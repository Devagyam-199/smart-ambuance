const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    number: { type: String, required: true, unique: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },

    userName: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"],
        required: true,
    },
    prevMedic: { type: String, default: "None" },
    alergies: { type: String, default: "None" },

    emergencyName: { type: String, required: true },
    emergencyNum: { type: String, required: true },

    location: {
        latitude: { type: String },
        longitude: { type: String },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
    },

    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
