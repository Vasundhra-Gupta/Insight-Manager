import { Icomments } from "../interfaces/commentInterface.js";
import { connection } from "../server.js";

export class SQLcomments extends Icomments {
    async getComments(postId, orderBy) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }

            // const q1 =
            //     "(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.comment_id AND is_liked = 1) AS likes";
            // const q2 =
            //     "(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.comment_id AND is_liked = 0) AS dislikes";
            // const q = `
            //         SELECT
            //             u.user_name,
            //             u.user_firstName,
            //             u.user_lastName,
            //             u.user_id,
            //             u.user_avatar,
            //             c.comment_id,
            //             c.comment_content,
            //             c.comment_createdAt,
            //             ${q1},
            //             ${q2}
            //         FROM comments c
            //         NATURAL JOIN users u
            //         WHERE post_id = ?
            //         ORDER BY c.comment_createdAt ${orderBy.toUpperCase()}
            //     `;

            const q = "SELECT * FROM comments WHERE post_id = ?;";
            const [result] = await connection.query(q, [postId]);
            if (!result?.length) {
                return { message: "NO_COMMENTS_FOUND" };
            }
            return result;
        } catch (err) {
            throw err;
        }
    }

    // only for checking if that comment exists or not
    async getComment(commentId, currentUserId) {
        try {
            const q1 =
                "(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.comment_id AND is_liked = 1) AS likes";
            const q2 =
                "(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.comment_id AND is_liked = 0) AS dislikes";

            let isLiked = 0;
            let isDisliked = 0;
            if (currentUserId) {
                const q3 = `SELECT is_liked FROM comment_likes WHERE comment_id = ? AND user_id = ?`;
                const [[response]] = await connection.query(q3, [commentId, currentUserId]);
                if (response) {
                    if (response.is_liked) isLiked = true;
                    else isDisliked = true;
                }
            }

            const q = `
                SELECT 
                    user_name,
                    user_firstName, 
                    user_lastName,
                    user_avatar,
                    c.*,
                    ${q1},
                    ${q2}
                FROM comments c 
                NATURAL JOIN users u 
                WHERE comment_id = ?
            `;
            const [[comment]] = await connection.query(q, [commentId]);

            if (!comment) {
                return { message: "COMMENT_NOT_FOUND" };
            }

            return { ...comment, isLiked, isDisliked };
        } catch (err) {
            throw err;
        }
    }

    async createComment(commentId, userId, postId, commentContent) {
        try {
            const q =
                "INSERT INTO comments(comment_id, user_id, post_id, comment_content) VALUES (?, ?, ?, ?)";
            await connection.query(q, [commentId, userId, postId, commentContent]);

            const comment = await this.getComment(commentId);
            if (comment?.message) {
                throw new Error("COMMENT_INSERTION_DB_ISSUE");
            }
            return comment;
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            const q = "DELETE FROM comments WHERE comment_id = ?";
            const [response] = await connection.query(q, [commentId]);
            if (response.affectedRows === 0) {
                throw new Error("COMMENT_DELETION_DB_ISSUE");
            }
            return { message: "COMMENT_DELETED_SUCCESSFULLY" };
        } catch (err) {
            throw err;
        }
    }

    async editComment(commentId, commentContent) {
        try {
            const q = "UPDATE comments SET comment_content= ? WHERE comment_id = ?";
            await connection.query(q, [commentContent, commentId]);
            const comment = await this.getComment(commentId);
            if (comment?.message) {
                throw new Error("COMMENT_UPDATION_DB_ISSUE");
            }
            return comment;
        } catch (err) {
            throw err;
        }
    }
}
