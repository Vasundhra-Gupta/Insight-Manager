import { Ilikes } from "../interfaces/likeInterface.js";
import { connection } from "../server.js";
import { postObject } from "../controllers/postController.js";
export class SQLlikes extends Ilikes {
    async getLikedPosts(userId) {
        const q = `
                SELECT
                	v.owner_id,
                    v.owner_avatar, 
                    v.owner_userName, 
                    v.owner_firstName, 
                    v.owner_lastName, 
                    v.post_id, 
                    v.post_visibility, 
                    v.post_updatedAt, 
                    v.post_title, 
                    v.post_content, 
                    v.post_image,
                    p.is_liked
                FROM post_owner_view v
                JOIN post_likes p
                WHERE 
                v.post_id = p.post_id 
                AND is_liked = 1 
                AND p.user_id = ? ;
            `;
        const [response] = await connection.query(q, [userId]);
        if (!response) {
            return { message: "NO_LIKED_POSTS" };
        }
        return response;
    }

    async toggleLikePost(postId, userId) {
        const post= postObject.getPost(postId, userId);
        
        const q= "UPDATE post_likes SET isLiked = ? WHERE post_id = ? AND user_id = ? ";
        await connection.query(q, [isLIked, postId, userId]);
        post.is_liked

    }

    async toogleLikeComment(commentId, isLiked) {
        const q = `
            UPDATE comment_likes SET is_liked = ? WHERE comment_id = ?
        `
        await connection.query(q, [isLiked, commentId]);

        ;
    }
}
