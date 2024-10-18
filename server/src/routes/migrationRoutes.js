import express from "express";
export const migrationRouter = express.Router();
import {
    migrateCategories,
    migratePosts,
    migrateUsers,
    migratePostLikes,
    migrateCommentLikes,
    migrateComments,
    migrateFollowers,
} from "../MigrationScripts/index.js";
import { dbInstance } from "../db/connectDB.js";
import { OK, SERVER_ERROR } from "../constants/errorCodes.js";

migrationRouter.route("/all").post(
    // migrateCategories,
    migrateUsers,
    // migrateCommentLikes,
    // migratePostLikes,
    // migrateComments,
    // migrateFollowers,
    // migratePosts,
    async (req, res) => {
        try {
            await dbInstance.mongodbMigrationDisconnect();
            return res.status(OK).json({
                message: "SUCCESSFULLY_MIGRATED_FROM_SQL-->MONGODB✨✨✨&CONNECTION_CLOSED",
            });
        } catch (err) {
            return res
                .status(SERVER_ERROR)
                .json({ message: "MONGODB_MIGRATION_CONNECTION_CLOSING_ISSUE" });
        }
    }
);

// migrationRouter.route("/disconnect").get(async (req, res) => {
//     try {
//         await dbInstance.mongodbMigrationDisconnect();
//         return res.status(OK).json({ message: "MONGODB_CONNECTION_CLOSED" });
//     } catch (err) {
//         return res
//             .status(SERVER_ERROR)
//             .json({ message: "MONGODB_MIGRATION_CONNECTION_CLOSING_ISSUE" });
//     }
// });

// ⭐⭐⭐ next() could cause issue

// migrationRouter.route("/posts").post(migratePosts);

// migrationRouter.route("/users").post(migrateUsers);

// migrationRouter.route("/post-likes").post(migratePostLikes);

// migrationRouter.route("/comment-likes").post(migrateCommentLikes);

// migrationRouter.route("/comments").post(migrateComments);

// migrationRouter.route("/followers").post(migrateFollowers);

// migrationRouter.route("/categories").post(migrateCategories);
