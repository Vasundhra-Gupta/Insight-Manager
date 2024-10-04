import { Iposts } from "../interfaces/postInterface.js";
import { connection } from "../server.js";

export class SQLposts extends Iposts {
    // pending search query
    async getRandomPosts(limit, orderBy, page, category) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }

            let q = `SELECT * FROM post_owner_view`;
            let countQ = "SELECT COUNT(*) AS totalPosts FROM post_owner_view";

            if (category) {
                q += `WHERE post_category = ?`;
                countQ += `WHERE post_category = ?`;
            }

            q += `ORDER BY post_updatedAt ${orderBy.toUpperCase()} LIMIT ? OFFSET ?`;

            const offset = (page - 1) * limit;
            const queryParams = category ? [category, limit, offset] : [limit, offset];
            const countParams = category ? [category] : [];

            const [[{ totalPosts }]] = await connection.query(countQ, countParams);
            const [posts] = await connection.query(q, queryParams);

            if (!posts?.length) {
                return { message: "NO_POSTS_FOUND" };
            }

            const totalPages = Math.ceil(totalPosts / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            return {
                totalPosts,
                totalPages,
                hasNextPage,
                hasPrevPage,
                posts,
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    async getPosts(userId, limit, orderBy, page, category) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }
            let q = `SELECT * FROM post_owner_view`;
            let countQ = "SELECT COUNT(*) AS totalPosts FROM post_owner_view";

            if (category) {
                q += `WHERE owner_id = ? AND post_category = ?`;
                countQ += `WHERE owner_id = ? AND post_category = ?`;
            } else {
                q += "WHERE owner_id = ?";
                countQ += "WHERE owner_id = ?";
            }

            q += `ORDER BY post_updatedAt ${orderBy.toUpperCase()} LIMIT ? OFFSET ?`;

            const offset = (page - 1) * limit;
            const queryParams = category ? [userId, category, limit, offset] : [userId, limit, offset];
            const countParams = category ? [userId, category] : [userId];

            const [posts] = await connection.query(q, queryParams);
            const [[{ totalPosts }]] = await connection.query(q, countParams);

            if (!posts?.length) {
                return { message: "NO_POSTS_FOUND" };
            }

            const totalPages = Math.ceil(totalPosts / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            return {
                totalPosts,
                totalPages,
                hasNextPage,
                hasPrevPage,
                posts,
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    async getPost(postId, userId) {
        try {
            const q = `
                    SELECT * FROM post_owner_view      -- quering from view directly
                    WHERE post_id = ?
                `;
            const [[post]] = await connection.query(q, [postId]);
            if (!post) {
                return { message: "POST_NOT_FOUND" };
            }

            let isLiked = 0;
            let isDisliked = 0;
            let isSaved = 0;

            if (userId) {
                const q1 = "SELECT is_liked FROM post_likes WHERE post_id = ? AND user_id = ?";
                const [[response1]] = await connection.query(q1, [postId, userId]);
                if (response1) {
                    if (response1.is_liked) isLiked = 1;
                    else isDisliked = 1;
                }

                const q2 = "SELECT COUNT(*) AS isSaved FROM saved_posts WHERE post_id = ? AND user_id = ?";
                const [[response2]] = await connection.query(q2, [postId, userId]);
                if (response2?.isSaved) {
                    isSaved = 1;
                }
            }

            return { ...post, isLiked, isDisliked, isSaved };
        } catch (err) {
            throw new Error(err);
        }
    }

    async createPost(postId, ownerId, title, content, category, image) {
        try {
            const q = "INSERT INTO posts (post_id, post_ownerId, post_title, post_content, post_category, post_image) VALUES (?, ?, ?, ?, ?, ?)";
            await connection.query(q, [postId, ownerId, title, content, category, image]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POST_CREATION_DB_ISSUE");
            }
            const { post_likes, post_dislikes, post_views, isLiked, isDisliked, isSaved, ...remainingPostDetails } = post;
            return remainingPostDetails;
        } catch (err) {
            throw new Error(err);
        }
    }

    async deletePost(postId) {
        try {
            const q = "DELETE FROM posts WHERE post_id = ?";
            const [result] = await connection.query(q, [postId]);
            if (result.affectedRows === 0) {
                throw new Error("POST_DELETION_DB_ISSUE");
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async updatePostViews(postId, userIdentifier) {
        try {
            const q1 = "SELECT COUNT(*) AS isViewed FROM post_views WHERE post_id = ? AND user_identifier = ?";
            const [[response]] = await connection.query(q1, [postId, userIdentifier]);
            if (response?.isViewed) {
                return;
            }

            const q = `INSERT INTO post_views values(?, ?)`;
            await connection.query(q, [postId, userIdentifier]);

            const [[response1]] = await connection.query(q1, [postId, userIdentifier]);
            if (!response1) {
                throw new Error({ message: "VIEW_INCREMENT_DB_ISSUE" });
            }
            return { message: "VIEW_INCREMENTED_SUCCESSFULLY" };
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateWatchHistory(postId, userId) {
        try {
            const q = `CALL updateWatchHistory (?, ?)`;
            const [[[response]]] = await connection.query(q, [postId, userId]);
            return response;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getWatchHistory(userId, orderBy, limit) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }

            const q = `
                    SELECT * 
                    FROM watch_history 
                    WHERE user_id = ?
                    ORDER BY watchedAt ${orderBy}
                    LIMIT ?
                `;
            const [watchHistory] = await connection.query(q, [userId, limit]);

            if (!watchHistory.length) {
                return { message: "EMPTY_WATCH_HISTORY" };
            }

            return watchHistory;
        } catch (err) {
            throw new Error(err);
        }
    }

    async clearWatchHistory(userId) {
        try {
            const q = "DELETE FROM watch_history WHERE user_id = ?";
            const response = await connection.query(q, [userId]);
            if (response.affectedRows === 0) {
                throw new Error({ message: "CLEARING_WATCH_HISTORY_DB_ISSUE" });
            }
            return { message: "WATCH_HISTORY_CLEARED_SUCCESSFULLY" };
        } catch (err) {
            throw new Error(err);
        }
    }

    async updatePostDetails(postId, title, content, category, updatedAt) {
        try {
            const q = "UPDATE posts SET post_title = ?, post_content = ?,post_category = ?, post_updatedAt = ? WHERE post_id = ?";
            await connection.query(q, [title, content, category, updatedAt, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTDETAILS_UPDATION_DB_ISSUE");
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updatePostImage(postId, image, updatedAt) {
        try {
            const q = "UPDATE posts SET post_image = ?, post_updatedAt = ? WHERE post_id = ?";
            await connection.query(q, [image, updatedAt, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTIMAGE_UPDATION_DB_ISSUE");
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }

    async togglePostVisibility(postId, visibility) {
        try {
            const q = "UPDATE posts SET post_visibility = ? WHERE post_id = ?";
            await connection.query(q, [visibility, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTVISIBILITY_UPDATION_DB_ISSUE");
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }

    async toggleSavePost(postId, userId) {
        try {
            const q = "CALL toggleSavePost(?, ?)";
            const [[[response]]] = await connection.query(q, [userId, postId]);
            return response;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getSavedPosts(userId, orderBy) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }
            const q = `
                    SELECT * 
                    FROM post_owner_view v
                    INNER JOIN saved_posts s 
                    ON v.post_id = s.post_id 
                    WHERE s.user_id = ?
                    ORDER BY v.post_updatedAt ${orderBy}
                `;
            const [savedPosts] = await connection.query(q, [userId]);
            if (!savedPosts.length) {
                return { message: "NO_SAVED_POSTS" };
            }

            return savedPosts;
        } catch (err) {
            throw new Error(err);
        }
    }
}
