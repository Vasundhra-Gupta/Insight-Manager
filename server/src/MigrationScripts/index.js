import { migrateUsers } from "./usersMigration.js";
import { migrateFollowers } from "./followersMigration.js";
import { migratePostLikes, migrateCommentLikes } from "./likesMigration.js";
import { migrateComments } from "./commentsMigration.js";
import { migrateCategories } from "./categoriesMigration.js";
import { migratePosts } from "./postsMigration.js";

export {
    migrateCategories,
    migrateComments,
    migrateFollowers,
    migratePostLikes,
    migrateCommentLikes,
    migratePosts,
    migrateUsers,
};
