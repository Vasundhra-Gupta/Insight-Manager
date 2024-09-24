import { Iposts } from "../interfaces/postInterface.js";
import { connection } from "../server.js";

export class SQLposts extends Iposts {
    async getRandomPosts() {}

    async getPosts(userId) {}

    async getPost(postId) {}

    async deletePost(postId) {}

    async updatePost(currentUserId, postId, title, content, image) {}

    async togglePostVisibility(PostId) {}

    async addPost(postId, ownerId, title, content, image) {}
}
