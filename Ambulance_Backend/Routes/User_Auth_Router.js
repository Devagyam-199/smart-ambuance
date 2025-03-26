const express = require("express");
const { UserSignupValidation, UserLoginValidation } = require("../Middlewares/User_Auth_Validation");

const { user_signup, user_login } = require("../Controllers/User_Signup_Control");

const user_router = express.Router();

user_router.post("/login_auth", UserLoginValidation, user_login);

user_router.post("/signup_auth", UserSignupValidation, user_signup);

module.exports = user_router;
