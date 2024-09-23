import jwt from "jsonwebtoken";
import { BAD_REQUEST, FORBIDDEN } from "../constants/errorCodes.js";
import getServiceObject from "../db/serviceObjects.js";

const userObject = getServiceObject("users");

const cookieOptions = {
    httpOnly: true,
    path: "/",
    // secure: true,
    sameSite: "None",
};

const optionalVerifyJwt = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.headers["autorization"]?.split(" ")[1];
    if (accessToken) {
        try {
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

            if (!decodedToken) {
                return res.status(FORBIDDEN).clearCookie("accessToken", cookieOptions).json({ message: "INVALID_ACCESS_TOKEN" });
            }

            const user = await userObject.getUser(decodedToken.user_id);
            if (!user) {
                return res.status(BAD_REQUEST).clearCookie("accessToken", cookieOptions).json({ message: "ACCESS_TOKEN_USER_NOT_FOUND" });
            }

            const { user_password, refresh_token, ...currentUser } = user;
            req.user = currentUser;
        } catch (err) {
            return res.status(500).clearCookie("accessToken", cookieOptions).json({ message: "EXPIRED_ACCESS_TOKEN", err: err.emssage });
        }
    }

    next();
};

export { optionalVerifyJwt };
