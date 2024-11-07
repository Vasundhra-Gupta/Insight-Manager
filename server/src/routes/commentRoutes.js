import express from 'express';
export const commentRouter = express.Router();
import { verifyJwt, optionalVerifyJwt } from '../middlewares/index.js';
import {
    addComment,
    updateComment,
    deleteComment,
    getComments,
    getComment,
} from '../controllers/commentController.js';

commentRouter.route('/post/:postId').get(optionalVerifyJwt, getComments);

commentRouter.use(verifyJwt);

commentRouter.route('/:postId').post(addComment);

commentRouter
    .route('/:commentId')
    .patch(updateComment)
    .delete(deleteComment)
    .get(getComment);
