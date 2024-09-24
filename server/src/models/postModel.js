import { Iposts } from "../interfaces/postInterface.js";
import { connection } from "../server.js";

export class SQLposts extends Iposts {
    async getRandomPosts(limit) {}

    async getPosts(userId) {}

    async getPost(postId) {}

    async addPost(postId, ownerId, title, content, image) {}

    async deletePost(postId) {}

    async updatePostDetails(postId, title, content, updatedAt) {}

    async updatePostImage(postId, image, updatedAt) {}

    async togglePostVisibility(PostId, visibility) {}
}
