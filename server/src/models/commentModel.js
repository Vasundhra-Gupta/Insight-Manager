import { Icomments } from "../interfaces/commentInterface.js";
import { connection } from "../server.js";

export class SQLcomments extends Icomments {
    async getComments(postId, orderBy) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }

            const q1 = "(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.comment_id AND is_liked = 1) AS commentLikes";
            const q2 = "(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.comment_id AND is_liked = 0) AS commentDislikes";
            const q = `
                    SELECT 
                        u.user_name, 
                        u.user_firstName, 
                        u.user_lastName, 
                        u.user_id, 
                        u.user_avatar, 
                        c.comment_id,
                        c.comment_content,
                        c.comment_createdAt,
                        ${q1},
                        ${q2}
                    FROM comments c 
                    NATURAL JOIN users u
                    WHERE post_id = ?
                    ORDER BY c.comment_createdAt ${orderBy.toUpperCase()}
                `;
            const [result] = await connection.query(q, [postId]);

            if (!result?.length) {
                return { message: "NO_COMMENTS_FOUND" };
            }
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    // only for checking if that comment exists or not
    async getComment(commentId) {
        try {
            const q = "SELECT * FROM comments WHERE comment_id = ? ";
            const [[comment]] = await connection.query(q, [commentId]);

            if (!comment) {
                return { message: "COMMENT_NOT_FOUND" };
            }

            return comment;
        } catch (err) {
            throw new Error(err);
        }
    }

    async createComment(commentId, userId, postId, commentContent) {
        try {
            const q = "INSERT INTO comments(comment_id, user_id, post_id, comment_content) VALUES (?, ?, ?, ?)";
            await connection.query(q, [commentId, userId, postId, commentContent]);

            const comment = await this.getComment(commentId);
            if (comment?.message) {
                throw new Error("COMMENT_INSERTION_DB_ISSUE");
            }
            return comment;
        } catch (err) {
            throw new Error(err);
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
            throw new Error(err);
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
            throw new Error(err);
        }
    }
}
