import { SQLusers } from "../models/userModel.js";
import { SQLposts } from "../models/postModel.js";

export default function getServiceObject(serviceType) {
    if (process.env.DATABASE_TYPE == "SQL") {
        switch (serviceType) {
            case "users":
                return new SQLusers();
            case "posts":
                return new SQLposts();
            case "notes":
                return SQLnotes();
            case "likes":
                return SQLlikes();
            case "comments":
                return SQLcomments();
            case "followers":
                return SQLfollowers();
            default:
                throw new Error("Unsupported service type");
        }
    } else {
        throw new Error("Unsupported Database Type");
    }
}
