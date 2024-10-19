import { connection } from "../server.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";
import { SavedPost } from "../schemas/MongoDB/userSchema.js";

export async function migratePostViews(req, res, next) {
    try {
        const [SQLpostViews] = await connection.query("SELECT * FROM post_views");

        if (SQLpostViews.length) {
            const SQLpostViewsKeys = SQLpostViews.map((v) => `${v.post_id} ${v.user_identifier}`);

            const [MongoDBpostViews] = await SavedPost.find();
    
            const MongoDBpostViewsKeys = MongoDBpostViews.map((v) => `${v.post_id} ${v.user_identifier}`);

            const newViewedPost = [];

            for (let post of SQLpostViews) {
                const key = `${post.post_id} ${post.user_identifier}`;
                if (!MongoDBpostViewsKeys.includes(key)) {
                    newViewedPost.push(post);
                }
            }

            const deletedViewedPost = MongoDBpostViews.filter((s) => {
                const key = `${s.post_id} ${s.user_identifier}`;
                return !SQLpostViewsKeys.includes(key);
            });

            if (newViewedPost.length) {
                await SavedPost.insertMany(newViewedPost);
            }

            if (deletedViewedPost.length) {
                const deleteFilters = deletedViewedPost.map((s) => ({
                    post_id: s.post_id,
                    user_identifier: s.user_identifier,
                }));
                await SavedPost.deleteMany({ $or: deleteFilters });
            }

            console.log(`${deletedViewedPost.length} new SAVEDPOSTS INSERTED \n ${deletedViewedPost} SAVEDPOSTS DELETED`);
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
