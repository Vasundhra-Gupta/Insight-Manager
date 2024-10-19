import { connection } from "../server.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";
import { PostLike, CommentLike } from "../schemas/MongoDB/likeSchema.js";

export async function migratePostLikes(req, res, next) {
    try {
        const [SQLlikedPosts] = await connection.query("SELECT * FROM post_likes");
        console.log(SQLlikedPosts);

        if (SQLlikedPosts.length) {
            // SQL saved posts keys
            const SQLlikedPostKeys = SQLlikedPosts.map((p) => `${p.post_id} ${p.user_id}`);

            // MongoDB saved posts
            const MongoDBlikedPosts = await PostLike.find();
            console.log(MongoDBlikedPosts);
            // MongoDB saved posts keys
            const MongoDBlikedPostsKeys = MongoDBlikedPosts.map((p) => `${p.post_id} ${p.user_id}`);

            const newLikedPosts = [];
            const updatedLikedPosts = [];

            //find records to Insert o update
            for (let post of SQLlikedPosts) {
                const key = `${post.post_id} ${post.user_id}`;
                if (!MongoDBlikedPostsKeys.includes(key)) {
                    newLikedPosts.push(post);
                } else {
                    const existingMongoPost = MongoDBlikedPosts.find(
                        (p) => p.post_id === post.post_id && p.user_id === post.user_id
                    );
                    if (existingMongoPost.is_liked !== Boolean(post.is_liked)) {
                        updatedLikedPosts.push(post);
                    }
                }
            }

            //find records to Delete
            const deletedlikedPosts = MongoDBlikedPosts.filter((s) => {
                const key = `${s.post_id} ${s.user_id}`;
                return !SQLlikedPostKeys.includes(key);
            });

            //Insert
            if (newLikedPosts.length) {
                await PostLike.insertMany(newLikedPosts);
            }

            //Update
            if (updatedLikedPosts.length) {
                const bulkOptions = updatedLikedPosts.map((p) => ({
                    updateOne: {
                        filter: { post_id: p.post_id, user_id: p.user_id },
                        update: {
                            $set: {
                                is_liked: p.is_liked,
                            },
                        },
                    },
                }));
                await PostLike.bulkWrite(bulkOptions);
            }

            //Delete
            if (deletedlikedPosts.length) {
                const deleteFilters = deletedlikedPosts.map((p) => ({
                    post_id: p.post_id,
                    user_id: p.user_id,
                }));
                await PostLike.deleteMany({ $or: deleteFilters });
            }

            console.log(
                `${newLikedPosts.length} new LIKEDPOSTS INSERTED.\n${updatedLikedPosts.length} LIKEDPOSTS UPDATED.\n${deletedlikedPosts.length} LIKEDPOSTS DELETED.`
            );
        } else {
            const count = PostLike.countDocuments();
            if (count) {
                await PostLike.deleteMany();
                console.log("CLEARED MONGODB LIKEDPOSTS");
            } else {
                console.log("NO_LIKEDPOSTS_TO_MIGRATE");
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating liked posts",
            error: err.message,
        });
    }
}

export async function migrateCommentLikes(req, res, next) {
    try {
        const [SQLlikedComments] = await connection.query("SELECT * FROM comment_likes");
        console.log(SQLlikedComments);

        if (SQLlikedComments.length) {
            // SQL saved comments keys
            const SQLlikedCommentKeys = SQLlikedComments.map((c) => `${c.comment_id} ${c.user_id}`);

            // MongoDB saved comments
            const MongoDBlikedComments = await CommentLike.find();
            console.log(MongoDBlikedComments);
            // MongoDB saved comments keys
            const MongoDBlikedCommentKeys = MongoDBlikedComments.map(
                (c) => `${c.comment_id} ${c.user_id}`
            );

            const newLikedComments = [];
            const updatedLikedComments = [];

            //find records to Insert o update
            for (let comment of SQLlikedComments) {
                const key = `${comment.comment_id} ${comment.user_id}`;
                if (!MongoDBlikedCommentKeys.includes(key)) {
                    newLikedComments.push(comment);
                } else {
                    const existingMongoComment = MongoDBlikedComments.find(
                        (c) => c.comment_id === comment.comment_id && c.user_id === comment.user_id
                    );
                    if (existingMongoComment.is_liked !== Boolean(comment.is_liked)) {
                        updatedLikedComments.push(comment);
                    }
                }
            }

            //find records to Delete
            const deletedlikedComments = MongoDBlikedComments.filter((c) => {
                const key = `${c.comment_id} ${c.user_id}`;
                return !SQLlikedCommentKeys.includes(key);
            });

            //Insert
            if (newLikedComments.length) {
                await CommentLike.insertMany(newLikedComments);
            }

            //Update
            if (updatedLikedComments.length) {
                const bulkOptions = updatedLikedComments.map((c) => ({
                    updateOne: {
                        filter: { comment_id: c.comment_id, user_id: c.user_id },
                        update: {
                            $set: {
                                is_liked: c.is_liked,
                            },
                        },
                    },
                }));
                await CommentLike.bulkWrite(bulkOptions);
            }

            //Delete
            if (deletedlikedComments.length) {
                const deleteFilters = deletedlikedComments.map((c) => ({
                    comment_id: c.comment_id,
                    user_id: c.user_id,
                }));
                await CommentLike.deleteMany({ $or: deleteFilters });
            }

            console.log(
                `${newLikedComments.length} new LIKEDCOMMENTS INSERTED.\n${updatedLikedComments.length} LIKEDCOMMENTS UPDATED.\n${deletedlikedComments.length} LIKEDCOMMENTS DELETED.`
            );
        } else {
            const count = CommentLike.countDocuments();
            if (count) {
                await CommentLike.deleteMany();
                console.log("CLEARED MONGODB LIKEDCOMMENTS");
            } else {
                console.log("NO_LIKEDCOMMENTS_TO_MIGRATE");
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating liked comments",
            error: err.message,
        });
    }
}

