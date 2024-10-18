import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Follower } from "../schemas/MongoDB/followerSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migrateFollowers(req, res, next) {
    try {
        // Fetch all followers from SQL
        const [SQLfollowers] = await connection.query("SELECT * FROM followers");
        console.log(SQLfollowers);

        if (SQLfollowers.length) {
            const SQLfollowerIds = SQLfollowers.map((follower) => follower.follower_id);

            // Fetch all existing followers from MongoDB
            const MongoDBfollowers = await Follower.find();
            const MongoDBfollowerIds = new Set(MongoDBfollowers.map((c) => c.follower_id));

            const newFollowers = [];

            // 1. Find new records to Insert
            for (let follower of SQLfollowers) {
                if (!MongoDBfollowerIds.has(follower.follower_id)) {
                    newFollowers.push(follower); // new
                }
            }

            // 2. Find deleted records (records in MongoDB but not in SQL)
            const deletedFollowersIds = await Follower.find({
                follower_id: { $nin: SQLfollowerIds },
            });

            // 3. Insert
            if (newFollowers.length > 0) {
                await Follower.insertMany(newFollowers);
            }

            // 5. Delete
            if (deletedFollowersIds.length > 0) {
                await Follower.deleteMany({ follower_id: { $in: deletedFollowersIds } });
            }

            console.log(
                `${newFollowers.length} new FOLLOWERS INSERTED.\n${deletedFollowersIds.length} FOLLOWERS DELETED.`
            );
        } else {
            console.log("NO_FOLLOWERS_TO_MIGRATE");
        }
        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating followers",
            error: err.message,
        });
    }
}

// export async function migrateFollowers(req, res, next) {
//     try {
//         const [followers] = await connection.query("SELECT * FROM followers");
//         console.log(followers);

//         if (followers.length) {
//             const result = await Follower.insertMany(followers);
//             console.log(result);

//             if (result.length) {
//                 console.log("FOLLOWERS_MIGRATED_SUCCESSFULLY");
//             } else {
//                 throw new Error({ message: "MONGODB_FOLLOWER_MIGRATION_ISSUE" });
//             }
//         } else {
//             return res.status(OK).json({ message: "NO_FOLLOWERS_TO_MIGRATE" });
//         }
//         next();
//     } catch (err) {
//         return res.status(BAD_REQUEST).json({
//             message: "something went wrong while migrating followers",
//             error: err.message,
//         });
//     }
// }
