import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // const instance = await mongoose.connect(process.env.MONOGO_DB_URL);
        // console.log(`\n MongoDB connected!! DB Host: ${instance.connection.host}`);
    } catch(error) {
        console.log("MONGODB connection FAILED", error);
        process.exit(1);
    }
}

export default connectDB;