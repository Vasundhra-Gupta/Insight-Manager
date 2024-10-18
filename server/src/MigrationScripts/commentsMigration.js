import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Comment } from "../schemas/MongoDB/commentSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migrateComments(req, res, next) {
    try {
        // Fetch all comments from SQL
        const [SQLcomments] = await connection.query("SELECT * FROM comments");
        console.log(SQLcomments);

        if (SQLcomments.length) {
            const SQLcommentIds = SQLcomments.map((comment) => comment.comment_id);

            // Fetch all existing comments from MongoDB
            const MongoDBcomments = await Comment.find();
            const MongoDBcommentIds = new Set(MongoDBcomments.map((c) => c.comment_id));

            const newComments = [];
            const updatedComments = [];

            // 1. Find new & updated records
            for (let comment of SQLcomments) {
                if (!MongoDBcommentIds.has(comment.comment_id)) {
                    // new comment
                    newComments.push(comment);
                } else {
                    // If exists, compare
                    const existingMongoComment = MongoDBcomments.find(
                        (c) => c.comment_id === comment.comment_id
                    );
                    if (existingMongoComment?.comment_content !== comment.comment_content) {
                        // If different, push to updatedComments array
                        updatedComments.push(comment);
                    }
                }
            }

            // 2. Find deleted records (records in MongoDB but not in SQL)
            const deletedCommentsIds = await Comment.find({
                comment_id: { $nin: SQLcommentIds },
            }).select("comment_id");

            // 3. Insert new comments
            if (newComments.length > 0) {
                await Comment.insertMany(newComments);
            }

            // 4. Update existing comments (bulk update)
            if (updatedComments.length > 0) {
                const bulkOptions = updatedComments.map((c) => ({
                    updateOne: {
                        filter: { comment_id: c.comment_id },
                        update: { $set: { comment_content: c.comment_content } },
                    },
                }));
                await Comment.bulkWrite(bulkOptions);
            }

            // 5. Delete comments that are deleted from SQL
            if (deletedCommentsIds.length > 0) {
                await Comment.deleteMany({ comment_id: { $in: deletedCommentsIds } });
            }
            console.log(
                `${newComments.length} new COMMENTS INSERTED.\n${updatedComments.length} COMMENTS UPDATED.\n${deletedCommentsIds.length} COMMENTS DELETED.`
            );
        } else {
            console.log("NO_COMMENTS_TO_MIGRATE");
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating comments",
            error: err.message,
        });
    }
}

// export async function migrateComments(req, res, next) {
//     try {
//         const [comments] = await connection.query("SELECT * FROM comments");
//         console.log(comments);

//         if (comments.length) {
//             const result = await Comment.insertMany(comments);
//             console.log(result);

//             if (result.length) {
//                 console.log("COMMENTS_MIGRATED_SUCCESSFULLY");
//             } else {
//                 throw new Error({ message: "MONGODB_COMMENT_MIGRATION_ISSUE" });
//             }
//         } else {
//             console.log("NO_COMMENTS_TO_MIGRATE");
//         }
//         next();
//     } catch (err) {
//         return res.status(SERVER_ERROR).json({
//             message: "something went wrong while migrating comments",
//             error: err.message,
//         });
//     }
// }
