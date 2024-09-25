export class Iposts {
    async getRandomPosts() {
        throw new Error("method getRandomPosts is not overwritten.");
    }

    async getPosts(userId) {
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

    async updatePostDetails(postId, title, content) {
        throw new Error("method updatePostDetails is not overwritten.");
    }
    async updatePostImage(image) {
        throw new Error("method updatePostDetails is not overwritten.");
    }

    async togglePostVisibility(postId, isVisible) {
        throw new Error("method togglePostVisibility is not overwritten.");
    }
}
