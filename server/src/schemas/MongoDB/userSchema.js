import { model, Schema } from "mongoose";

const userSchema = new Schema({
    user_id: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    user_name: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    user_firstName: {
        type: String,
        required: true,
    },
    user_lastName: {
        type: String,
    },
    user_bio: {
        type: String,
        default: "",
    },
    user_avatar: {
        type: String,
        required: true,
    },
    user_coverImage: {
        type: String,
    },
    user_email: {
        type: String,
        unique: true,
        required: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    user_createdAt: {
        type: Date,
        default: Date.now(),
    },
    refresh_token: {
        type: String,
        default: "",
    },
});

const savedPostSchema = {
    post_id: {
        type: String,
        required: true,
        ref: "posts",
    },
    user_id: {
        type: String,
        required: true,
        ref: "users",
        index: true
    },
};

const watchHistorySchema = {
    post_id: {
        type: String,
        required: true,
        ref: "posts",
    },
    user_id: {
        type: String,
        required: true,
        ref: "users",
        index: true
    },
    watchedAt: {
        type: Date,
        default: Date.now(),
    },
};

const User = model("User", userSchema);
const SavedPost = model("SavedPost", savedPostSchema);
const WatchHistory = model("WatchHistory", watchHistorySchema);
export { User, SavedPost, WatchHistory };