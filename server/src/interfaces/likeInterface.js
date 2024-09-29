export class Ilikes{
    async getLikedPosts(userId){
        throw new Error("Method getLikedPost not overwritten.");
    }

    async toggleLikePost(postId, userId){
        throw new Error("Method toggleLikePost not overwritten.");
    }

    async toogleLikeComment(commentId, isLiked){
        throw new Error("Method toogleLikeComment not overwritten.");
    }
}