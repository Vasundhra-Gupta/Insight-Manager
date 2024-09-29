import { SQLusers } from "../models/userModel.js";
import { SQLposts } from "../models/postModel.js";
import { SQLnotes } from "../models/noteModel.js";
import { SQLlikes } from "../models/likeModel.js";
import { SQLcomments } from "../models/commentModel.js";
import { SQLfollowers } from "../models/followerModel.js";

export default function getServiceObject(serviceType) {
    if (process.env.DATABASE_TYPE == "SQL") {
        switch (serviceType) {
            case "users":
                return new SQLusers();
            case "posts":
                return new SQLposts();
            case "notes":
                return new SQLnotes();
            case "likes":
                return new SQLlikes();
            case "comments":
                return new SQLcomments();
            case "followers":
                return new SQLfollowers();
            default:
                throw new Error("Unsupported service type");
        }
    } else {
        throw new Error("Unsupported Database Type");
    }
}
