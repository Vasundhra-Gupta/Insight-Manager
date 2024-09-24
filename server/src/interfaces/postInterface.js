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

    async addPost(postId, ownerId, title, content, image) {
        throw new Error("method addPost is not overwritten");
    }

    async deletePost(postId) {
        throw new Error("method deletePost is not overwritten.");
    }

    async updatePost(currentUserId, postId, title, content, image) {
        throw new Error("method updatePost is not overwritten.");
    }

    async togglePostVisibility(PostId) {
        throw new Error("method togglePostVisibility is not overwritten.");
    }
}
