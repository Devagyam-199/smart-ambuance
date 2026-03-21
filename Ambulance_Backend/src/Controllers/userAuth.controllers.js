import verifyToken  from "../services/msg91.services.js"
import User from "../Models/Users.models.js"
import jwt from "jsonwebtoken"

export const verifyTokenController = async (req, res) => {
  const { accessToken, role = "User" } = req.body

  if (!accessToken) {
    return res.status(400).json({
      success: false,
      error: "accessToken from MSG91 widget is required"
    })
  }

  try {
    const mobile = await verifyToken(accessToken)

    const phone = `+${mobile}`

    let user = await User.findOne({ phoneNumber: phone })
    if (!user) {
      user = await User.create({
        phoneNumber: phone,
        role: "User",
      })
    }

    const jwtToken = jwt.sign(
      { userId: user._id, phone: user.phoneNumber, role: user.role },
      process.env.Access_Token_Secret,
      { expiresIn: "1d" }
    )

    return res.status(200).json({
      success: true,
      message: "Authenticated successfully",
      data: { accessToken: jwtToken, user }
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-__v")
    if (!user) return res.status(404).json({ success: false, error: "User not found" })
    return res.status(200).json({ success: true, user })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}