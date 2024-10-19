import { connection } from "../server.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";
import { PostView } from "../schemas/MongoDB/postSchema.js";

export async function migratePostViews(req, res, next) {
    try {
        const [SQLviews] = await connection.query("SELECT * FROM post_views");
        console.log(SQLviews);

        if (SQLviews.length) {
            const SQLviewKeys = SQLviews.map((v) => `${v.post_id} ${v.user_identifier}`);

            const MongoDBviews = await PostView.find();
            console.log(MongoDBviews);

            const MongoDBviewKeys = MongoDBviews.map((v) => `${v.post_id} ${v.user_identifier}`);

            const newViews = [];

            for (let view of SQLviews) {
                const key = `${view.post_id} ${view.user_identifier}`;
                if (!MongoDBviewKeys.includes(key)) {
                    newViews.push(view);
                }
            }

            const deletedViews = MongoDBviews.filter((v) => {
                const key = `${v.post_id} ${v.user_identifier}`;
                return !SQLviewKeys.includes(key);
            });

            if (newViews.length) {
                await PostView.insertMany(newViews);
            }

            if (deletedViews.length) {
                const deleteFilters = deletedViews.map((v) => ({
                    post_id: v.post_id,
                    user_identifier: v.user_identifier,
                }));
                await PostView.deleteMany({ $or: deleteFilters });
            }

            console.log(
                `${newViews.length} new VIEWS INSERTED.\n${deletedViews.length} VIEWS DELETED.`
            );
        } else {
            const count = PostView.countDocuments();
            if (count) {
                await PostView.deleteMany();
                console.log("CLEARED MONGODB VIEWS\n");
            } else {
                console.log("NO_VIEWS_TO_MIGRATE");
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating views",
            error: err.message,
        });
    }
}
