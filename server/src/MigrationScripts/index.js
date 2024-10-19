import { migrateUsers } from "./usersMigration.js";
import { migrateFollowers } from "./followersMigration.js";
import { migratePostLikes, migrateCommentLikes } from "./likesMigration.js";
import { migrateComments } from "./commentsMigration.js";
import { migrateCategories } from "./categoriesMigration.js";
import { migratePosts } from "./postsMigration.js";
import { migratePostViews } from "./postViewsMigration.js";
import { migrateWatchHistory } from "./watchHistoryMigration.js";
import { migrateSavedPosts } from "./savedPostsMigration.js";

export {
    migrateCategories,
    migrateComments,
    migrateFollowers,
    migratePostLikes,
    migrateCommentLikes,
    migratePosts,
    migrateUsers,
    migratePostViews,
    migrateSavedPosts,
    migrateWatchHistory,
};
