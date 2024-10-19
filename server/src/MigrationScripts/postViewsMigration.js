import { connection } from "../server.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";
import { SavedPost } from "../schemas/MongoDB/userSchema.js";

export async function migratePostViews(req, res, next) {
    try {
        const [SQLviewedPost] = await connection.query("SELECT * FROM post_views");

        if (SQLviewedPost.length) {
            const SQLviewedPostKeys = SQLviewedPost.map((v) => `${v.post_id} ${v.user_identifier}`);

            const [MongoDBviewedPost] = await SavedPost.find();
    
            const MongoDBviewedPostKeys = MongoDBviewedPost.map((v) => `${v.post_id} ${v.user_identifier}`);

            const newViewedPost = [];

            for (let post of SQLviewedPost) {
                const key = `${post.post_id} ${post.user_identifier}`;
                if (!MongoDBviewedPostKeys.includes(key)) {
                    newViewedPost.push(post);
                }
            }

            const deletedViewedPost = MongoDBpostViews.filter((v) => {
                const key = `${v.post_id} ${v.user_identifier}`;
                return !SQLviewedPostKeys.includes(key);
            });

            if (newViewedPost.length) {
                await SavedPost.insertMany(newViewedPost);
            }

            if (deletedViewedPost.length) {
                const deleteFilters = deletedViewedPost.map((v) => ({
                    post_id: v.post_id,
                    user_identifier: v.user_identifier,
                }));
                await SavedPost.deleteMany({ $or: deleteFilters });
            }

            console.log(`${deletedViewedPost.length} new VIEWEDPOSTS INSERTED \n ${deletedViewedPost} VIEWEDPOSTS DELETED`);
        } else {
            const count = SavedPost.countDocuments();
            if (count) {
                await SavedPost.deleteMany();
                console.log("CLEARED MONGODB VIEWEDPOSTS\n");
            } else {
                console.log("NO_VIEWEDPOSTS_TO_MIGRATE");
            }
        }
        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating viewed posts",
            error: err.message,
        });
    }
}
