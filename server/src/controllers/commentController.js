import { BAD_REQUEST, SERVER_ERROR} from "../constants/errorCodes.js";
import validator from "validator";
import getServiceObject from "../db/serviceObjects.js";

const commentObject= getServiceObject("comments");

const getComments= async(req, res)=>{
    try {
        const {postId} = req.params;
        if(!postId){
            return res.status(BAD_REQUEST).json({ message : "POSTID_MISSING"});
        }
        const comments = await commentObject.getComments(postId);
        return res.status(OK).json(comments);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            error : err.message,
            message : "something went wrong while getting the post comments"
        })
    }
}

const addComment= async (req,res)=>{
    try {
        const {user_id} = req.user;
        const {postId} = req.params;
        const {commentContent} = req.body;
        const commentId = uuid();

        if(!validator.isUUID(commentId)){
            return res.status(BAD_REQUEST).json({ message : "INVALID_UUID"})
        }
        if(!user_id){
            return res.status(BAD_REQUEST).json({ message : "USERID_MISSING"});
        }

        if(!postId){
            return res.status(BAD_REQUEST).json({ message : "POSTID_MISSING"});
        }
    
        if(!commentContent){
            return res.status(BAD_REQUEST).json({ message : "CONTENT_MISSING"});
        }

        const comment = await commentObject.createComment(commentId, user_id, postId, commentContent);
        return res.status(OK).json(comment);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            error : err.message,
            message : "something went wrong while creating the comment"
        })
    }
}

const deleteComment = async(req, res)=>{
    try {
        const {user_id} = req.user;
        const {commentId} = req.params;
        
        if(!commentId){
            return res.status(BAD_REQUEST).json({ message : "COMMENT_ID_MISSING"})
        }
        if(!user_id){
            return res.status(BAD_REQUEST).json({ message : "USERID_MISSING"});
        }

        await commentObject.deleteComment(commentId);
        return res.status(OK).json({ message : "COMMENT_DELETED_SUCCESSFULLY"})
        
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            error : err.message,
            message : "something went wrong while deleting the comment"
        })
    }
}

const updateComment= async(req, res)=>{
    try {
        const {commentContent} = req.body;
        const {commentId} = req.params;

        if(!commentContent){
            return res.status(BAD_REQUEST).json({ message : "CONTENT_MISSING"});
        }
        if(!commentId){
            return res.status(BAD_REQUEST).json({ message : "COMMENT_ID_MISSING"})
        }
        await commentObject.editComment(commentId, commentContent)
        const updatedComment= await commentObject.getComment(commentId);
        res.status(OK).json(updatedComment);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            err: err.message,
            message : "something went wrong while editing the comment"
        })
    }
}

export {
    getComments,
    addComment,
    deleteComment,
    updateComment
}