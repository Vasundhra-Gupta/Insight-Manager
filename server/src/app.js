import express from 'express';
export const app = express();
import cookieParser from 'cookie-parser';
import { dbInstance } from './db/connectDB.js';
import { OK, SERVER_ERROR } from './constants/errorCodes.js';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../public'));
app.use(cookieParser());

import {
    userRouter,
    postRouter,
    followerRouter,
    commentRouter,
    likeRouter,
    migrationRouter,
} from './routes/index.js';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/followers', followerRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use(
    '/api/v1/migrations',
    async (req, res, next) => {
        try {
            await dbInstance.mongodbMigrationConnect(); // connect
            next();
        } catch (err) {
            return res.status(SERVER_ERROR).json({
                message: 'MONGO MIGRATION CONNECTION ERROR',
            });
        }
    },
    migrationRouter, // migrate
    async (req, res) => {
        try {
            await dbInstance.mongodbMigrationDisconnect(); // disconnect
            return res.status(OK).json({
                message:
                    'SUCCESSFULLY_MIGRATED_FROM_SQL->MONGODB✨_&_CONNECTION_CLOSED',
            });
        } catch (err) {
            return res.status(SERVER_ERROR).json({
                message: 'MONGODB_CONNECTION_CLOSING_ISSUE',
            });
        }
    }
);
