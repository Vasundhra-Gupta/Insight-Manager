import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Follower } from "../schemas/MongoDB/followerSchema.js";
import { BAD_REQUEST, OK } from "../constants/errorCodes.js";

export async function migrateFollowers() {
    try {
        const [followers] = await connection.query("SELECT * FROM followers");
        console.log(followers);

        if (followers.length) {
            // const transformedCategories = followers.map((follower) => ({
            //     category_id: category.category_id,
            //     category_name: category.category_name,
            // }));

            const result = await Follower.insertMany(followers, { ordered: false });
            console.log(result);
            return res.status(OK).json({ message: "FOLLOWERS_MIGRATED_SUCCESSFULLY" });
        } else {
            return res.status(OK).json({ message: "NO_FOLLOWERS_TO_MIGRATE" });
        }
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            message: "something went wrong while migrating followers",
            error: err.message,
        });
    }
}
