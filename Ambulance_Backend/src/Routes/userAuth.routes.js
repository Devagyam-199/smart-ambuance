import { Router } from "express"
import { verifyTokenController, getMe } from "../Controllers/userAuth.controllers.js"
import jwtVerify from "../Middlewares/jwtVerifier.middlewares.js"

const authRoute = Router()

authRoute.post("/verify", verifyTokenController)   // public
authRoute.get("/user",    jwtVerify, getMe)        // protected

export default authRoute