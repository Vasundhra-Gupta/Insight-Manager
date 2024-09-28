import { Icomments } from "../interfaces/commentInterface.js";
import { connection } from "../server.js";
export class SQLcomments extends Icomments{
    async getComments(postId){
        const q = "SELECT * FROM comments WHERE post_id = ? "
        const [result]= await connection.query(q, [postId])

        if(!result){
            return { message : "COMMENTS_NOT_FOUND"}
        }
        return result
    }

    async getComment(commentId){
        try{
            const q = "SELECT * FROM comments WHERE commentId = ? "
            const comment = await connection.query(q, [commentId]);

            if(!comment){
                return {message : "COMMENT_NOT_FOUND"}
            }

            return comment;
        }catch(err){
            throw new Error(err);
        }
    }

    async createComment(commentId, userId, postId, commentContent){
        try {
            const q = "INSERT INTO comments VALUES (?, ?, ?, ?)";
            await connection.query(q, [commentId, userId, postId, commentContent]);
            
            const comment=  await this.getComment(commentId);
            if(comment?.message){
                throw new Error("COMMENT_INSERTION_DB_ISSUE");
            }
            return comment;
        } catch (err) {
            throw new Error(err);
        }
    }
    
    async deleteComment(commentId){
        try{
            const q= "DELETE FROM comments WHERE comment_id = ?";
            const [response]= await connection.query(q, [commentId]);
            if(response.affectedRows === 0){
                throw new Error("COMMENT_DELETION_DB_ISSUE");
            }
        }catch(err){
            throw new Error(err);
        }
    }

    async editComment(commentId){
        try{
            const q= "UPDATE comments SET comment_content= ? WHERE comment_id = ?";
            await connection.query(q, [content, commentId]);
            const comment= await this.getComment(commentId);
            if(comment?.message){
                throw new Error("COMMENT_UPDATION_DB_ISSUE");
            }
            return comment;
        }catch(err){
            throw new Error(err);
        }
    }

}