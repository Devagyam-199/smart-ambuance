import admin from "../config/firebase.js";
import jwt from "jsonwebtoken";
import User from "../Models/Users.models.js";
import apiError from "../Utils/apiError.utils.js";

const userAuth = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new apiError(400, "Id Token is missing for authentication");
  }

  try {
    const decodedUid = await admin.auth().verifyIdToken(idToken);
    const decodedPhoneNumber = decodedUid.phone_number;

    let user = await User.findOne({ phoneNumber: decodedPhoneNumber });
    if (!user) {
      user = await User.create({
        phoneNumber: decodedPhoneNumber,
        firebaseUid: decodedUid.uid,
      });
    } else {
      await user.save();
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        phoneNum: decodedPhoneNumber,
      },
      process.env.Access_Token_Secret,
      {
        expiresIn: "30d",
      },
    );

    res.status(201).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    throw new apiError(
      500,
      `Error while authentication, Source:(userAuthController), ${error}`,
    );
  }
};

export default userAuth;
