import { connection } from "../server.js";
import { WatchHistory } from "../schemas/MongoDB/userSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migrateWatchHistory(req, res, next) {
    try {
        const [SQLwatchHistory] = await connection.query("SELECT * FROM watch_history");
        console.log(SQLwatchHistory);

        if (SQLwatchHistory.length) {
            const SQLwatchHistoryKeys = SQLwatchHistory.map((w) => `${w.post_id} ${w.user_id}`);

            const MongoDBwatchHistory = await WatchHistory.find();
            console.log(MongoDBwatchHistory);

            const MongoDBwatchHistoryKeys = MongoDBwatchHistory.map(
                (w) => `${w.post_id} ${w.user_id}`
            );

            const newWatchHistory = [];
            const updatedWatchHistory = [];

            for (let post of SQLwatchHistory) {
                const key = `${post.post_id} ${post.user_id}`;
                if (!MongoDBwatchHistoryKeys.includes(key)) {
                    newWatchHistory.push(post);
                } else {
                    // If exists, compare
                    const existingMongoHistoryPost = MongoDBwatchHistory.find(
                        (p) => p.user_id === post.user_id && p.post_id === post.post_id
                    );

                    if (existingMongoHistoryPost.watchedAt.getTime() !== post.watchedAt.getTime()) {
                        // or use JSON.stringify()
                        // If different, push to updatedUsers array
                        updatedWatchHistory.push(post);
                    }
                }
            }

            const deletedWatchHistory = MongoDBwatchHistory.filter((w) => {
                const key = `${w.post_id} ${w.user_id}`;
                return !SQLwatchHistoryKeys.includes(key);
            });

            if (newWatchHistory.length) {
                await WatchHistory.insertMany(newWatchHistory);
            }

            // 4. Update (bulk update)
            if (updatedWatchHistory.length > 0) {
                const bulkOptions = updatedWatchHistory.map((p) => ({
                    updateOne: {
                        filter: {
                            post_id: p.post_id,
                            user_id: p.user_id,
                        },
                        update: {
                            $set: {
                                watchedAt: p.watchedAt,
                            },
                        },
                    },
                }));
                await WatchHistory.bulkWrite(bulkOptions);
            }

            if (deletedWatchHistory.length) {
                deleteFilters = deletedWatchHistory.map((w) => ({
                    post_id: w.post_id,
                    user_id: w.user_id,
                }));
                await WatchHistory.deleteMany({ $or: deleteFilters });
            }

            console.log(
                `${newWatchHistory.length} NEW WATCH HISTORY POSTS INSERTED.\n${updatedWatchHistory.length} WATCH HISTORY POSTS UPDATED.\n${deletedWatchHistory.length} WATCH HISTORY POSTS DELETED.`
            );
        } else {
            const count = await WatchHistory.countDocuments();
            if (count) {
                await WatchHistory.deleteMany();
                console.log("CLEARED MONGODB WATCHHISTORY");
            } else {
                console.log("NO POSTS TO MIGRATE IN WATCH HISTORY");
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating watch history.",
            error: err.message,
        });
    }
}
