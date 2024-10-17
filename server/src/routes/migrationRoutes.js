import express from "express";
export const migrationRouter = express.Router();
import {
    migrateCategories,
    migratePosts,
    migrateUsers,
    migrateLikes,
    migrateComments,
    migrateFollowers,
} from "../MigrationScripts/index.js";
import { connectMongoDB, disconnectMongoDB } from "../db/MongoDBMigrationConnection.js";

migrationRouter.route("/connect-MongoDB").get(connectMongoDB);

migrationRouter.route("/disconnect-MongoDB").get(disconnectMongoDB);

migrationRouter.route("/posts").post(migratePosts);

migrationRouter.route("/users").post(migrateUsers);

migrationRouter.route("/likes").post(migrateLikes);

migrationRouter.route("/comments").post(migrateComments);

migrationRouter.route("/followers").post(migrateFollowers);

migrationRouter.route("/categories").post(migrateCategories);
