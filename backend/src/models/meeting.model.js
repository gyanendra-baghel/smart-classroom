import mongoose, {Schema} from "mongoose"
import { User } from "./user.model";


const meetingSchema = new Schema({
    roomID: {
        type: String,
        required:[true, "RoomID is required"],
        unique: true,
        trim: true
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    host: {
        type: User,
        required: true
    },
    participants: {
        type: [User]
    }
});

export const Meeting = mongoose.model("Meeting", meetingSchema);