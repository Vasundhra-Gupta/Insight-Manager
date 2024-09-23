import bcrypt from "bcrypt";
import { BAD_REQUEST, SERVER_ERROR } from "../constants/errorCodes.js";

export const verifyPassword = async (password, hashedPassword, res) => {
    try {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordValid) {
            return { message: "WRONG_CREDENTIALS" };
        }
        return;
    } catch (err) {
        throw new Error({ message: "something went wrong while validating the password.", error: err.message });
    }
};
