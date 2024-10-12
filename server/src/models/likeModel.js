import { Ilikes } from "../interfaces/likeInterface.js";
import { connection } from "../server.js";

export class SQLlikes extends Ilikes {
    async getLikedPosts(userId, orderBy, limit) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }
            const q = `
                    SELECT
                    	v.owner_id,
                        v.owner_avatar, 
                        v.owner_userName, 
                        v.owner_firstName, 
                        v.owner_lastName, 
                        v.post_id, 
                        v.post_updatedAt, 
                        v.post_title, 
                        v.post_content, 
                        v.post_views,
                        v.post_image
                    FROM post_owner_view v
                    JOIN post_likes pl
                    WHERE v.post_id = pl.post_id AND pl.is_liked = 1 AND pl.user_id = ? 
                    ORDER BY v.post_updatedAt ${orderBy.toUpperCase()} 
                    LIMIT ?
                `;
            const [response] = await connection.query(q, [userId, limit]);
            if (!response?.length) {
                return { message: "NO_LIKED_POSTS" };
            }
            return response;
        } catch (err) {
            throw err;
        }
    }

    async togglePostLike(postId, userId, likedStatus) {
        try {
            const q = "CALL togglePostLike(?, ?, ?)";
            const [[[response]]] = await connection.query(q, [userId, postId, likedStatus]);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async toggleCommentLike(commentId, userId, likedStatus) {
        try {
            const q = "CALL toggleCommentLike(?, ?, ?)";
            const [[[response]]] = await connection.query(q, [userId, commentId, likedStatus]);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async toggleNoteVote(noteId, userId, voteStatus) {
        try {
            const q = "CALL toggleNoteVote(?, ?, ?)";
            const [[[response]]] = await connection.query(q, [userId, noteId, voteStatus]);
            return response;
        } catch (err) {
            throw err;
        }
    }
}
