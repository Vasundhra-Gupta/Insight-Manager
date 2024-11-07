import express from 'express';
export const migrationRouter = express.Router();
import {
    migrateUsers,
    migratePosts,
    migrateComments,
    migrateFollowers,
    migrateCategories,
    migratePostLikes,
    migrateCommentLikes,
    migratePostViews,
    migrateSavedPosts,
    migrateWatchHistory,
} from '../MigrationScripts/index.js';

migrationRouter
    .route('/db')
    .post(
        migrateUsers,
        migratePosts,
        migrateComments,
        migrateFollowers,
        migrateCategories,
        migratePostLikes,
        migrateCommentLikes,
        migratePostViews,
        migrateSavedPosts,
        migrateWatchHistory
    );

migrationRouter.route('/users').post(migrateUsers);

migrationRouter.route('/posts').post(migratePosts);

migrationRouter.route('/comments').post(migrateComments);

migrationRouter.route('/followers').post(migrateFollowers);

migrationRouter.route('/categories').post(migrateCategories);

migrationRouter.route('/post-likes').post(migratePostLikes);

migrationRouter.route('/comment-likes').post(migrateCommentLikes);

migrationRouter.route('/views').post(migratePostViews);

migrationRouter.route('/saved').post(migrateSavedPosts);

migrationRouter.route('/history').post(migrateWatchHistory);
