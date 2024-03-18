import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
        username: {
            type: String,
            required:[true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true
        },
        refreshToken: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function(next) {  // if password changed then bcrypt it
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(this.password, password);
}


userSchema.methods.generateToken = function ({ _id, username }) {
    return jwt.sign({ _id, username }, process.env.JWT_SECRET_KEY);
}

export const User = mongoose.model("User", userSchema);