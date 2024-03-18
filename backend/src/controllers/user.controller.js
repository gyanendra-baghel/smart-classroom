import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    const {fullname, email, username, password} = req.body

    if([fullname, email, username, password].some((field) => field.trim() === "")) {
        throw new Error("All fields are required.");
    }

    const existedUser = User.findOne({ username });

    if(existedUser) {
        throw new Error("User with username already exists.");
    }

    const newUser = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase()
    })

    if(!newUser) {
        throw new Error("Something went wrong");
    }

    return res.status(201).json({
        statusCode: 200,
        user: newUser,
        message: "User is created."
    })
}

const loginUser = async (req, res) => {
    const { username, password } = req.body

    if(!username) {
        throw new Error("Username is required!");
    }

    const user = await User.findOne({ username })

    if(!user) {
        throw new Error("User does not exists!")
    }

    const isValidPassword = await user.isPasswordCorrect(password);

    if(!isValidPassword) {
        throw new Error("Invalid user credentials.");
    }

    // console.log("username and password matched");

    const accessToken = user.generateToken(user);
}

const logoutUser = () => {}

export {
    registerUser,
    loginUser,
    logoutUser
}