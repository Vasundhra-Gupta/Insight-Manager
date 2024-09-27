export class Iposts {
    async getRandomPosts(limit, orderBy) {
        throw new Error("method getRandomPosts is not overwritten.");
    }

    async getPosts(userId, limit, orderBy) {
        throw new Error("method getPosts is not overwritten.");
    }

    async getPost(postId) {
        throw new Error("method getPost is not overwritten.");
    }

    async createPost(postId, ownerId, title, content, image) {
        throw new Error("method addPost is not overwritten");
    }

    async deletePost(postId) {
        throw new Error("method deletePost is not overwritten.");
    }

    async updatePostDetails(postId, title, content, updatedAt) {
        throw new Error("method updatePostDetails is not overwritten.");
    }

    async updatePostImage(postId, image, updatedAt) {
        throw new Error("method updatePostImage is not overwritten.");
    }

    async togglePostVisibility(PostId, visibility) {
        throw new Error("method togglePostVisibility is not overwritten.");
    }
}
