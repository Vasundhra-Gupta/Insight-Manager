class LikeService {
    async togglePostLike(postId) {
        try {
            const res = await fetch(`/api/v1/likes/toggle-post-like/${postId}`, {
                method: "PATCH",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in togglePostLike service: ${err.message}`);
            throw err;
        }
    }

    async toggleCommentLike(commentId) {
        try {
            const res = await fetch(`/api/v1/likes/toggle-comment-like/${commentId}`, {
                method: "PATCH",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in toggleCommentLike service: ${err.message}`);
            throw err;
        }
    }

    async getLikedPosts(limit = 10, page = 1, orderBy = "desc") {
        try {
            const res = await fetch(
                `/api/v1/likes?limit=${limit}&page=${page}&orderBy=${orderBy}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in getLikedPosts service: ${err.message}`);
            throw err;
        }
    }
}

export const likeService = new LikeService();
