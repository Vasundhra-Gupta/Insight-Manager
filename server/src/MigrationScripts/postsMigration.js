import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Post } from "../schemas/MongoDB/postSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migratePosts(req, res, next) {
    try {
        // Fetch all posts from SQL
        const [SQLposts] = await connection.query("SELECT * FROM posts");
        console.log(SQLposts);

        if (SQLposts.length) {
            const SQLpostIds = SQLposts.map((post) => post.post_id);

            // Fetch all existing posts from MongoDB
            const MongoDBposts = await Post.find();
            const MongoDBpostIds = MongoDBposts.map((c) => c.post_id);

            const newPosts = [];
            const updatedPosts = [];

            // 1. Find new & updated records
            for (let post of SQLposts) {
                if (!MongoDBpostIds.includes(post.post_id)) {
                    // new post
                    newPosts.push(post);
                } else {
                    // If exists, compare
                    const existingMongoPost = MongoDBposts.find((c) => c.post_id === post.post_id);
                    if (
                        Object.entries(existingMongoPost).some(
                            ([key, value]) => Object.keys(post).includes(key) && value !== post[key]
                        )
                        // existingMongoPost.post_title !== post.post_title ||
                        // existingMongoPost.post_content !== post.post_content ||
                        // existingMongoPost.post_image !== post.post_image ||
                        // existingMongoPost.post_visibility !== Boolean(post.post_visibility) ||
                        // existingMongoPost.post_category !== post.post_category ||
                        // existingMongoPost.post_updatedAt !== post.post_updatedAt
                    ) {
                        // If different, push to updatedPosts array
                        updatedPosts.push(post);
                    }
                }
            }

            // 2. Find deleted records (records in MongoDB but not in SQL)
            const deletedPosts = await Post.find({
                post_id: { $nin: SQLpostIds },
            });

            // 3. Insert
            if (newPosts.length > 0) {
                await Post.insertMany(newPosts);
            }

            // 4. Update (bulk update)
            if (updatedPosts.length > 0) {
                const bulkOptions = updatedPosts.map((p) => ({
                    updateOne: {
                        filter: { post_id: p.post_id },
                        update: {
                            $set: {
                                post_title: p.post_title,
                                post_content: p.post_content,
                                post_category: p.post_category,
                                post_image: p.post_image,
                                post_visibility: p.post_visibility,
                                post_updatedAt: p.post_updatedAt,
                            },
                        },
                    },
                }));
                await Post.bulkWrite(bulkOptions);
            }

            // 5. Delete
            if (deletedPosts.length > 0) {
                const deletedPostsIds = deletedPosts.map((p) => p.post_id);
                await Post.deleteMany({ post_id: { $in: deletedPostsIds } });
            }

            console.log(
                `${newPosts.length} new POSTS INSERTED.\n${updatedPosts.length} POSTS UPDATED.\n${deletedPosts.length} POSTS DELETED.`
            );
        } else {
            const count = await Post.countDocuments();
            if (count) {
                await Post.deleteMany();
                console.log("CLEARED MONGODB POSTS\n");
            } else {
                console.log("NO_POSTS_TO_MIGRATE");
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating posts",
            error: err.message,
        });
    }
}

// export async function migratePosts(req, res, next) {
//     try {
//         const [posts] = await connection.query("SELECT * FROM posts");
//         console.log(posts);

//         if (posts.length) {
//             const result = await Post.insertMany(posts);
//             console.log(result);

//             if (result.length) {
//                 console.log("POSTS_MIGRATED_SUCCESSFULLY");
//             } else {
//                 throw new Error({ message: "MONGODB_POST_MIGRATION_ISSUE" });
//             }
//         } else {
//             console.log("NO_POSTS_TO_MIGRATE");
//         }
//         next();
//     } catch (err) {
//         return res.status(SERVER_ERROR).json({
//             message: "something went wrong while migrating posts",
//             error: err.message,
//         });
//     }
// }
