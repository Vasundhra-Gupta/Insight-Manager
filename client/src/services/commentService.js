class CommentService {
    async getComments(postId, orderBy = "desc") {
        try {
            const res = await fetch(`/api/v1/comments/${postId}?orderBy=${orderBy}`, {
                method: "GET",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in getComments service: ${err.message}`);
        }
    }

    async addComment(postId, content) {
        try {
            const res = await fetch(`/api/v1/comments/${postId}`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ commentContent: content }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in addComment service: ${err.message}`);
        }
    }

    async updateComment(commentId, content) {
        try {
            const res = await fetch(`/api/v1/comments/${commentId}`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({ commentContent: content }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in updateComment service: ${err.message}`);
        }
    }

    async deleteComment(commentId) {
        try {
            const res = await fetch(`/api/v1/comments/${commentId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in deleteComment service: ${err.message}`);
        }
    }
}

export const commentService = new CommentService();
