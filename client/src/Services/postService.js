class PostService {
    async getRandomPosts(page = 1, limit = 10, orderBy = "desc") {
        try {
            const res = await fetch(
                `/api/v1/posts/all?limit=${limit}&orderBy=${orderBy}&page=${page}`,
                {
                    method: "GET",
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in getRandomPosts service: ${err.message}`);
            throw err;
        }
    }

    async getPosts(channelId, limit = 10, page = 1, orderBy = "desc") {
        try {
            const res = await fetch(
                `/api/v1/posts/channel/${channelId}?limit=${limit}&orderBy=${orderBy}&page=${page}`,
                {
                    method: "GET",
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in getPosts service: ${err.message}`);
        }
    }

    async getPost(postId) {
        try {
            const res = await fetch(`/api/v1/posts/post/${postId}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in getPost service: ${err.message}`);
        }
    }

    async updatePostDetails(title, content) {
        try {
            const res = await fetch(`/api/v1/posts/update-details/${postId}`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({ title, content }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in updatePostDetails service: ${err.message}`);
        }
    }

    async updatePostImage(postImage) {
        try {
            const formData = new FormData();
            formData.append("postImage", postImage);

            const res = await fetch("/api/v1/posts/update-image", {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in updatePostImage service: ${err.message}`);
        }
    }

    async deletePost(postId) {
        try {
            const res = await fetch(`/api/v1/posts/delete/${postId}`, {
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
            return console.error(`error in deletePost service: ${err.message}`);
        }
    }

    async addPost(inputs) {
        try {
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await fetch("/api/v1/posts/add", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in addPost service: ${err.message}`);
        }
    }

    async togglePostVisibility(postId) {
        try {
            const res = await fetch(`/api/v1/posts/toggle-visibility/${postId}`, {
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
            return console.error(`error in togglePostVisibility service: ${err.message}`);
        }
    }

    async getSavedPosts(orderBy = "desc") {
        try {
            const res = await fetch(`/api/v1/posts/saved?orderBy=${orderBy}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in getSavedPosts service: ${err.message}`);
        }
    }

    async toggleSavePost(postId) {
        try {
            const res = await fetch(`/api/v1/posts/toggle-save/${postId}`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in toggleSavePost service: ${err.message}`);
        }
    }
}

export const postService = new PostService();
