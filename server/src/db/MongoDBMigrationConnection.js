import mongoose from "mongoose";
import { BAD_REQUEST, OK } from "../constants/errorCodes.js";

export async function connectMongoDB(req, res) {
    try {
        const conn = await mongoose.connect(
            `${process.env.MONGODB_URL}${process.env.MONGODB_DB_NAME}`
        );
        console.log(`MONGODB connection successfull !! , host: ${conn.connection.host}`);
        return res.status(OK).json({ message: "MongoDB connected Successfully." });
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            message: "something went wrong while connection Mongodb for migration",
            error: err.message,
        });
    }
}

export async function disconnectMongoDB(req, res) {
    try {
        await mongoose.disconnect();
        return res.status(OK).json({ message: "MongoDB connection closed." });
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            message: "something went wrong while closing MongoDB migration connection.",
            error: err.message,
        });
    }
}
