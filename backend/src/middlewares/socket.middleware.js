import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifySocket = async(socket, next) => {
    try {
        const username = socket.handshake.query.userName;
        const roomID = socket.handshake.query.roomName;
        // console.log(token);
        if (!username || !roomID) {
            return next(new Error("Unauthorized request"));
        }
    
        if (username.length < 3 || roomID.length < 3) {
            return next(new Error("Invalid request"));
        }
    
        socket.user = { username, roomID };
        next()
    } catch (error) {
        return next(new Error( error?.message || "Invalid access token"))
    }
}


// try {
//     const token = socket.handshake.query.accessToken;
//     // console.log(token);
//     if (!token) {
//         return next(new Error("Unauthorized request"));
//     }

//     const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
//     const user = await User.findById(decodedToken?._id).select("-username");

//     if (!user) {
//         return next(new Error("Invalid Access Token"))
//     }

//     socket.user = user;
//     next()
// } catch (error) {
//     return next(new Error( error?.message || "Invalid access token"))
// }