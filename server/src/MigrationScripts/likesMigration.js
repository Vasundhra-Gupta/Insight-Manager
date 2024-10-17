import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Like } from "../schemas/MongoDB/likeSchema.js";
import { BAD_REQUEST, OK } from "../constants/errorCodes.js";

export async function migrateLikes() {
    try {
        const [likes] = await connection.query("SELECT * FROM likes");
        console.log(likes);

        if (likes.length) {
            // const transformedCategories = likes.map((like) => ({
            //     category_id: category.category_id,
            //     category_name: category.category_name,
            // }));

            const result = await Like.insertMany(likes, { ordered: false });
            console.log(result);
            return res.status(OK).json({ message: "LikeS_MIGRATED_SUCCESSFULLY" });
        } else {
            return res.status(OK).json({ message: "NO_LikeS_TO_MIGRATE" });
        }
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            message: "something went wrong while migrating likes",
            error: err.message,
        });
    }
}
