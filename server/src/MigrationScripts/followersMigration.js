import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Follower } from "../schemas/MongoDB/followerSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migrateFollowers(req, res, next) {
    try {
        // Fetch all followers from SQL
        const [SQLfollowers] = await connection.query("SELECT * FROM followers");
        console.log(SQLfollowers);

        if (SQLfollowers.length) {
            const SQLfollowerKeys = SQLfollowers.map((f) => `${f.follower_id} ${f.following_id}`);

            // Fetch all existing followers from MongoDB
            const MongoDBfollowers = await Follower.find();
            const MongoDBfollowerKeys = MongoDBfollowers.map(
                (f) => `${f.follower_id} ${f.following_id}`
            );
            const newFollowers = [];

            // 1. Find new records to Insert
            for (let follower of SQLfollowers) {
                const key = `${follower.follower_id} ${follower.following_id}`;
                if (!MongoDBfollowerKeys.includes(key)) {
                    newFollowers.push(follower); // new
                }
            }

            // 2. Find deleted records (records in MongoDB but not in SQL)
            const deletedFollowers = MongoDBfollowers.filter((f) => {
                const key = `${f.follower_id} ${f.following_id}`;
                return !SQLfollowerKeys.includes(key);
            });

            // 3. Insert
            if (newFollowers.length > 0) {
                await Follower.insertMany(newFollowers);
            }

            // 5. Delete
            if (deletedFollowers.length > 0) {
                const deleteFilters = deletedFollowers.map((f) => ({
                    follower_id: f.follower_id,
                    following_id: f.following_id,
                }));

                await Follower.deleteMany({ $or: deleteFilters });
            }

            console.log(
                `${newFollowers.length} new FOLLOWERS INSERTED.\n${deletedFollowers.length} FOLLOWERS DELETED.`
            );
        } else {
            const count = await Follower.countDocuments();
            if (count) {
                await Follower.deleteMany();
                console.log("CLEARED MONGODB FOLLOWERS\n");
            } else {
                console.log("NO_FOLLOWERS_TO_MIGRATE");
            }
        }
        
        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating followers",
            error: err.message,
        });
    }
}


