import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT = async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            return next(new Error("Unauthorized request"))
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            return next(new Error("Invalid Access Token"))
        }
    
        req.user = user;
        next()
    } catch (error) {
        return next(new Error(error?.message || "Invalid access token"))
    }
    
}