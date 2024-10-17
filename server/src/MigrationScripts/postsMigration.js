import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Post } from "../schemas/MongoDB/postSchema.js";
import { BAD_REQUEST, OK } from "../constants/errorCodes.js";

export async function migratePosts() {
    try {
        const [posts] = await connection.query("SELECT * FROM posts");
        console.log(posts);

        if (posts.length) {
            // const transformedCategories = posts.map((post) => ({
            //     category_id: category.category_id,
            //     category_name: category.category_name,
            // }));

            const result = await Post.insertMany(posts, { ordered: false });
            console.log(result);
            return res.status(OK).json({ message: "POSTS_MIGRATED_SUCCESSFULLY" });
        } else {
            return res.status(OK).json({ message: "NO_POSTS_TO_MIGRATE" });
        }
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            message: "something went wrong while migrating posts",
            error: err.message,
        });
    }
}
