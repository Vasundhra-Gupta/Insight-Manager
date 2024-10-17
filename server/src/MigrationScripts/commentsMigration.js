import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Comment } from "../schemas/MongoDB/commentSchema.js";
import { BAD_REQUEST, OK } from "../constants/errorCodes.js";

export async function migrateComments() {
    try {
        const [comments] = await connection.query("SELECT * FROM comments");
        console.log(comments);

        if (comments.length) {
            // const transformedCategories = comments.map((comment) => ({
            //     category_id: category.category_id,
            //     category_name: category.category_name,
            // }));

            const result = await Comment.insertMany(comments, { ordered: false });
            console.log(result);
            return res.status(OK).json({ message: "COMMENTS_MIGRATED_SUCCESSFULLY" });
        } else {
            return res.status(OK).json({ message: "NO_COMMENTS_TO_MIGRATE" });
        }
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            message: "something went wrong while migrating comments",
            error: err.message,
        });
    }
}
