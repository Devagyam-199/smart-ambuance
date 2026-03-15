import jwt from "jsonwebtoken"
import apiError from "../Utils/apiError.utils.js"

const jwtVerify = async(req, res, next)=>{
    const authheader = req.headers.authorization;

    if(!authheader || !authheader.startsWith("Bearer ")){
        throw new apiError(401,"No token provided for the request");
    }

    const jwttoken = authheader.split(' ')[1];

    try {
        const decoded = jwt.decode(jwttoken,process.env.Access_Token_Secret);
        req.user = decoded;
        next();
    } catch (error) {
        throw new apiError(401,"The token may be invalid or expires, Source:(verifyTokenMiddleware)")
    }
}

export default jwtVerify