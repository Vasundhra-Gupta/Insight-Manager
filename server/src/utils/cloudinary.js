import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { SERVER_ERROR } from "../constants/errorCodes.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return res.status(SERVER_ERROR).json({ message: "CLOUDIANRY_FILE_PATH_MISSING" });
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log(response);

        fs.unlinkSync(localFilePath);

        return response;
    } catch (err) {
        fs.unlinkSync(localFilePath);
        return res
            .status(SERVER_ERROR)
            .json({ message: "SERVER_ERROR_UPLOADING_CLOUDINARY_UTIL", err: err.message });
    }
};

const deleteFromCloudinary = async (URL) => {
    try {
        if (!URL) {
            return res.status(SERVER_ERROR).json({ message: "CLOUDINARY_URL_MISSING" });
        }

        const publicId = URL.split("/").pop().split(".")[0];
        const resourceType = URL.split("/")[4];

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });

        return response; // {result:"ok"}
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .json({ message: "SERVER_ERROR_DELETION_CLOUDINARY_UTIL", err: err.message });
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
