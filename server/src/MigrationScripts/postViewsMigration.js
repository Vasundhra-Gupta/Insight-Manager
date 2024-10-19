import { connection } from "../server.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";
import { PostView } from "../schemas/MongoDB/postSchema.js";

export async function migratePostViews(req, res, next) {
    try {
        const [SQLviewedPost] = await connection.query("SELECT * FROM post_views");

        if (SQLviewedPost.length) {
            const SQLviewedPostKeys = SQLviewedPost.map((v) => `${v.post_id} ${v.user_identifier}`);

            const [MongoDBviewedPost] = await PostView.find();
    
            const MongoDBviewedPostKeys = MongoDBviewedPost.map((v) => `${v.post_id} ${v.user_identifier}`);

            const newViewedPost = [];

            for (let post of SQLviewedPost) {
                const key = `${post.post_id} ${post.user_identifier}`;
                if (!MongoDBviewedPostKeys.includes(key)) {
                    newViewedPost.push(post);
                }
            }

            const deletedViewedPost = MongoDBviewedPost.filter((v) => {
                const key = `${v.post_id} ${v.user_identifier}`;
                return !SQLviewedPostKeys.includes(key);
            });

            if (newViewedPost.length) {
                await PostView.insertMany(newViewedPost);
            }

            if (deletedViewedPost.length) {
                const deleteFilters = deletedViewedPost.map((v) => ({
                    post_id: v.post_id,
                    user_identifier: v.user_identifier,
                }));
                await PostView.deleteMany({ $or: deleteFilters });
            }

            console.log(`${deletedViewedPost.length} new VIEWEDPOSTS INSERTED \n ${deletedViewedPost} VIEWEDPOSTS DELETED`);
        } else {
            const count = PostView.countDocuments();
            if (count) {
                await PostView.deleteMany();
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
