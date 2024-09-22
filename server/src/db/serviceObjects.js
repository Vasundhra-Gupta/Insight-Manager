import { SQLusers } from "../models/userModel.js";

export default function getServiceObject(serviceType) {
    if (process.env.DATABASE_TYPE == "SQL") {
        switch (serviceType) {
            case "users":
                return new SQLusers();
            case "posts":
                return new SQLposts();
            default:
                throw new Error("Unsupported service type");
        }
    } else {
        throw new Error("Unsupported Database Type");
    }
}
