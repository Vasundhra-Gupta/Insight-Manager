import { connection } from "../server.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";
import { SavedPost } from "../schemas/MongoDB/userSchema.js";

export async function migrateSavedPosts(req, res, next) {
    try {
        // SQL saved posts
        const [SQLsavedPosts] = await connection.query("SELECT * FROM saved_posts");

        if (SQLsavedPosts.length) {
            // SQL saved posts keys
            const SQLsavedPostKeys = SQLsavedPosts.map((s) => `${s.post_id} ${s.user_id}`);

            // MongoDB saved posts
            const [MongoDBsavedPosts] = await SavedPost.find();
            // MongoDB saved posts keys
            const MongoDBsavedPostsKeys = MongoDBsavedPosts.map((s) => `${s.post_id} ${s.user_id}`);

            const newSavedPost = [];

            //find records to Insert
            for (let savedPost of SQLsavedPosts) {
                const key = `${savedPost.post_id} ${savedPost.user_id}`;
                if (!MongoDBsavedPostsKeys.includes(key)) {
                    newSavedPost.push(savedPost);
                }
            }

            //find records to Delete
            const deletedSavedPost = MongoDBsavedPosts.filter((s) => {
                const key = `${s.post_id} ${s.user_id}`;
                return !SQLsavedPostKeys.includes(key);
            });

            //Insert
            if (newSavedPost.length) {
                await SavedPost.insertMany(newSavedPost);
            }

            //Delete
            if (deletedSavedPost.length) {
                const deleteFilters = deletedSavedPost.map((s) => ({
                    post_id: s.post_id,
                    user_id: s.user_id,
                }));
                await SavedPost.deleteMany({ $or: deleteFilters });
            }

            console.log(`${newSavedPost.length} new SAVEDPOSTS INSERTED \n ${deletedSavedPost} SAVEDPOSTS DELETED`);
        } else {
            const count = SavedPost.countDocuments();
            if (count) {
                await SavedPost.deleteMany();
                console.log("CLEARED MONGODB SAVEDPOSTS\n");
            } else {
                console.log("NO_SAVEDPOSTS_TO_MIGRATE");
            }
        }
        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating saved posts",
            error: err.message,
        });
    }
}
