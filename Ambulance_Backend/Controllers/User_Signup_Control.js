const User = require('../Models/User_Cred');
const bcrypt = require('bcryptjs'); 
const jwttoken = require('jsonwebtoken');
const otpStore = new Map(); 

const user_signup = async (req, res) => { 
    try {
        const {
            fullName, email, number, dob, gender, userName,
            password, confirmPassword, otp, bloodGroup, prevMedic, allergies,
            emergencyName, emergencyNum, location
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: `Email already exists, please login`,
                success: false
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName, email, number, dob, gender, userName,
            password: hashedPassword,
            otp, bloodGroup, prevMedic, allergies, emergencyName, emergencyNum, location
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup successful!",
            success: true
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const user_login = async (req, res) => { 
    try {
        const { identifier, password } = req.body;
        const existingUser = await User.findOne({
            $or: [{ email: identifier }, { userName: identifier }]
        });

        if (!existingUser) {
            return res.status(403).json({
                message: "User does not exist!",
                success: false
            });
        }

        const isPassEqual = await bcrypt.compare(password, existingUser.password);
        if (!isPassEqual) {
            return res.status(400).json({
                message: "Incorrect password",
                success: false
            });
        }

        const token = jwttoken.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful!",
            success: true,
            token,
            name: existingUser.fullName
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { user_signup, user_login };