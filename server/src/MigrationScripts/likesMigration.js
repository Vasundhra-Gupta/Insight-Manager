import { connection } from "../server.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";
import { PostLike, CommentLike } from "../schemas/MongoDB/likeSchema.js";

export async function migrateSavedPosts(req, res, next) {
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
            const updatedLikedPost = [];

            //find records to Insert o update
            for (let post of SQLlikedPosts) {
                const key = `${post.post_id} ${post.user_id}`;
                if (!MongoDBlikedPostsKeys.includes(key)) {
                    newLikedPosts.push(post);
                } else {
                    const existingMongoPost = MongoDBlikedPosts.filter((p) => p.post_id === post.post_id && p.user_id === post.user_id);
                    existingMongoPost.map((p) => {
                        if (p.is_liked != post.is_liked) {
                            updatedLikedPost.push(post);
                        }
                    });
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
            if (updatedLikedPost.length) {
                const bulkOptions = updatedLikedPost.map(
                    ((p) => ({
                        updateOne: {
                            filter: { post_id: p.post_id, user_id: p.user_id },
                            update: {
                                $set: {
                                    is_liked: p.is_liked,
                                },
                            },
                        },
                    }))
                );
                await PostLike.bulkWrite(bulkOptions);
            }

            //Delete
            if (deletedlikedPosts.length) {
                const deleteFilters = deletedlikedPosts.map((s) => ({
                    post_id: s.post_id,
                    user_id: s.user_id,
                }));
                await PostLike.deleteMany({ $or: deleteFilters });
            }

            console.log(`${newLikedPosts.length} new LIKEDPOSTS INSERTED \n ${deletedlikedPosts.length} LIKEDPOSTS DELETED`);
        } else {
            const count = PostLike.countDocuments();
            if (count) {
                await PostLike.deleteMany();
                console.log("CLEARED MONGODB LIKEDPOSTS\n");
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
