import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, logoutUser} from "../controllers/user.controller.js"

const userRouter = Router();

userRouter.route("/login").post(registerUser);
userRouter.route("/signup").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);

export default userRouter;