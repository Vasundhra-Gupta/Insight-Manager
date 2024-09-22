import getServiceObject from "../db/serviceObjects.js";
import { OK, SERVER_ERROR, BAD_REQUEST } from "../constants/errorCodes.js";
import { v4 as uuid, validate as isValiduuid } from "uuid";
import fs from "fs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userObject = getServiceObject("users");

const cookieOptions = {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "None",
};

const generateTokens = async (id) => {
    try {
        const user = await userObject.getUser(id);
        if (user) {
            const accessToken = jwt.sign(
                {
                    id,
                    userName: user.user_name,
                    email: user.user_email,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                }
            );
            const refreshToken = jwt.sign(
                {
                    id,
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
                }
            );
            await userObject.updateTokens(id, refreshToken);
            return { accessToken, refreshToken };
        }
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            error: err.message,
            message: "something went wrong while generating the tokens.",
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const id = uuid();
        const { userName, firstName, lastName, email, password } = req.body;

        if (!userName || !firstName || !email || !password) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        const existingUser = await userObject.getUser(userName);

        if (!existingUser?.message) {
            if (req.files?.avatar) {
                fs.unlinkSync(req.files.avatar[0].path);
            }
            if (req.files?.coverImage) {
                fs.unlinkSync(req.files.coverImage[0].path);
            }
            return res.status(BAD_REQUEST).json({ message: "USER_ALREADY_EXISTS" });
        }

        if (!req.files?.avatar) {
            if (req.files?.coverImage) {
                fs.unlinkSync(req.files.coverImage[0].path);
            }
            return res.status(BAD_REQUEST).json({ message: "MISSING_AVATAR" });
        }

        const avatar = await uploadOnCloudinary(req.files.avatar[0].path);

        let coverImage;
        if (req.files?.coverImage) {
            coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
        }

        const avatarURL = avatar.url;
        const coverImageURL = coverImage.url;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userObject.createUser(id, userName, firstName, lastName, avatarURL, coverImageURL, email, hashedPassword);

        if (user?.message) {
            return res.status(BAD_REQUEST).json({ message: user.message });
        } else {
            return res.status(OK).json(user);
        }
    } catch (err) {
        return res.status(SERVER_ERROR).json({ message: "something went wrong while registering the user.", error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { loginInput, password } = req.body;
        if (!loginInput || !password) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        const user = await userObject.getUser(loginInput);

        if (user) {
            console.log(password, user.user_password);
            const isPasswordValid = await bcrypt.compare(password, user.user_password);
            if (!isPasswordValid) {
                return res.status(BAD_REQUEST).json({ message: "WRONG_CREDENTIALS" });
            } else {
                const { accessToken, refreshToken } = generateTokens(user.user_id);
                const { user_password, refresh_token, ...loggedUser } = user;

                return res
                    .status(OK)
                    .cookie("accessToken", accessToken, {
                        ...cookieOptions,
                        maxAge: parseInt(process.env.ACCESS_TOKEN_MAXAGE), // cause .env saves everything in strings
                    })
                    .cookie("refreshToken", refreshToken, {
                        ...cookieOptions,
                        maxAge: parseInt(process.env.REFRESH_TOKEN_MAXAGE),
                    })
                    .json(loggedUser);
            }
        }
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while logging the user.",
            error: err.message,
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { user_id } = req.user;
        await userObject.deleteAccount(user_id);
        return res.status(OK).json({ message: "DELETION_SUCCESSFULL" });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while delete the user account.",
            error: err.message,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { user_id } = req.user;
        await userObject.logout(user_id);
        return res.status(OK).json({ message: "LOGGED_OUT_SUCCESSFULLY" });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while logging the user out.",
            error: err.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const { user_id } = req.user;
        const user = await userObject.getUser(user_id);
        if (user?.message) {
            throw new Error(user.message);
        } else {
            const { user_password, ...currentUser } = user;
            return res.status(OK).json(currentUser);
        }
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting the current user.",
            error: err.message,
        });
    }
};

const getChannelProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userObject.getUser(username);
        if (user?.message) {
            throw new Error(user.message);
        } else {
            const { user_password, ...currentUser } = user;
            return res.status(OK).json(currentUser);
        }
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting the channel profile.",
            error: err.message,
        });
    }
};

const updateAccountDetails = async (req, res) => {};

const updateChannelDetails = async (req, res) => {};

const updatePassword = async (req, res) => {};

const updateAvatar = async (req, res) => {};

const updateCoverImage = async (req, res) => {};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(BAD_REQUEST).json({ message: "Id is missing" });
        const { name, firstName, lastName, avatar, coverImage, email, password } = req.body;
        const result = await userObject.editUser(id, name, firstName, lastName, avatar, coverImage, email, password);
        if (result?.message) return res.status(BAD_REQUEST).json({ message: result.message });
        else return res.status(OK).json(result);
    } catch (err) {
        return res.status(SERVER_ERROR).json({ error: "Failed to edit user", message: err.message });
    }
};

export { registerUser, loginUser, logoutUser, deleteAccount, updateAccountDetails, updateAvatar, updateChannelDetails, updatePassword, updateCoverImage, getChannelProfile, getCurrentUser };
