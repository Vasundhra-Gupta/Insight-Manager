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

            let q = `
                    SELECT 
                        p.*,
                        c.user_name AS userName,
                        c.user_firstName AS firstName,
                        c.user_lastName AS lastName,
                        c.user_avatar AS avatar,
                        c.user_coverImage AS coverImage 
                    FROM post_view p 
                    JOIN channel_view c 
                    ON p.post_ownerId = c.user_id 
                `;

            let countQ = "SELECT COUNT(*) AS totalPosts FROM post_view p ";

            if (category) {
                q += ` WHERE p.category_name = ? `;
                countQ += ` WHERE p.category_name = ? `;
            }

            q += ` ORDER BY post_updatedAt ${orderBy.toUpperCase()} LIMIT ? OFFSET ? `;

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
                postsInfo: { totalPosts, totalPages, hasNextPage, hasPrevPage },
                posts,
            };
        } catch (err) {
            throw err;
        }
    }

    async getPosts(channelId, limit, orderBy, page, category) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }

            let q = `
                    SELECT 
                        p.*,
                        c.user_name AS userName,
                        c.user_firstName AS firstName,
                        c.user_lastName AS lastName,
                        c.user_avatar AS avatar,
                        c.user_coverImage AS coverImage
                    FROM post_view p 
                    JOIN channel_view c 
                    ON p.post_ownerId = c.user_id
                `;

            let countQ = "SELECT COUNT(*) AS totalPosts FROM post_view p";

            if (category) {
                q += ` WHERE p.post_ownerId = ? AND p.category_name = ? `;
                countQ += ` WHERE p.post_ownerId = ? AND p.category_name = ? `;
            } else {
                q += " WHERE p.post_ownerId = ? ";
                countQ += " WHERE p.post_ownerId = ? ";
            }

            q += `ORDER BY post_updatedAt ${orderBy.toUpperCase()} LIMIT ? OFFSET ? `;

            const offset = (page - 1) * limit;
            const queryParams = category
                ? [channelId, category, limit, offset]
                : [channelId, limit, offset];
            const countParams = category ? [channelId, category] : [channelId];

            const [posts] = await connection.query(q, queryParams);
            const [[{ totalPosts }]] = await connection.query(countQ, countParams);

            if (!posts?.length) {
                return { message: "NO_POSTS_FOUND" };
            }

            const totalPages = Math.ceil(totalPosts / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            return {
                postsInfo: { totalPosts, totalPages, hasNextPage, hasPrevPage },
                posts,
            };
        } catch (err) {
            throw err;
        }
    }

    async getPost(postId, userId) {
        try {
            const q = `
                    SELECT 
                        p.*,
                        c.user_name AS userName,
                        c.user_firstName AS firstName,
                        c.user_lastName AS lastName,
                        c.user_avatar AS avatar,
                        c.user_coverImage AS coverImage
                    FROM post_view p 
                    JOIN channel_view c 
                    ON c.user_id = p.post_ownerId
                    WHERE post_id = ?
                `;

            const [[post]] = await connection.query(q, [postId]);
            if (!post) {
                return { message: "POST_NOT_FOUND" };
            }

            let isLiked = false;
            let isDisliked = false;
            let isSaved = false;
            let isFollowed = false;

            if (userId) {
                const q1 = "SELECT is_liked FROM post_likes WHERE post_id = ? AND user_id = ?";
                const [[response1]] = await connection.query(q1, [postId, userId]);
                if (response1) {
                    if (response1.is_liked) isLiked = true;
                    else isDisliked = true;
                }

                const q2 =
                    "SELECT COUNT(*) AS isSaved FROM saved_posts WHERE post_id = ? AND user_id = ?";
                const [[response2]] = await connection.query(q2, [postId, userId]);
                if (response2?.isSaved) {
                    isSaved = true;
                }

                const q3 =
                    "SELECT COUNT(*) AS isFollowed FROM followers WHERE following_id = ? AND follower_id = ?";
                const [[response3]] = await connection.query(q3, [post.post_ownerId, userId]);
                if (response3?.isFollowed) {
                    isFollowed = true;
                }
            }

            return { ...post, isLiked, isDisliked, isSaved, isFollowed };
        } catch (err) {
            throw err;
        }
    }

    async createPost(postId, ownerId, title, content, category, image) {
        try {
            let categoryId;
            if (category) {
                const q =
                    "SELECT category_id AS categoryId FROM categories WHERE category_name = ?";
                [[{ categoryId }]] = await connection.query(q, [category]);
                if (!categoryId) {
                    throw new Error({ message: "FINDING_CATEGORY_ID_DB_ISSUE" });
                }
            }
            const q =
                "INSERT INTO posts (post_id, post_ownerId, post_title, post_content, post_category, post_image) VALUES (?, ?, ?, ?, ?, ?)";
            await connection.query(q, [postId, ownerId, title, content, categoryId, image]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POST_CREATION_DB_ISSUE");
            }
            const {
                post_likes,
                post_dislikes,
                post_views,
                isLiked,
                isDisliked,
                isSaved,
                ...remainingPostDetails
            } = post;
            return remainingPostDetails;
        } catch (err) {
            throw err;
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
            throw err;
        }
    }

    async updatePostViews(postId, userIdentifier) {
        try {
            const q1 =
                "SELECT COUNT(*) AS isViewed FROM post_views WHERE post_id = ? AND user_identifier = ?";
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
            throw err;
        }
    }

    async updatePostDetails(postId, title, content, category, updatedAt) {
        try {
            const q =
                "UPDATE posts SET post_title = ?, post_content = ?,post_category = ?, post_updatedAt = ? WHERE post_id = ?";
            await connection.query(q, [title, content, category, updatedAt, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTDETAILS_UPDATION_DB_ISSUE");
            }
            return post;
        } catch (err) {
            throw err;
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
            throw err;
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
            throw err;
        }
    }

    async toggleSavePost(postId, userId) {
        try {
            const q = "CALL toggleSavePost(?, ?)";
            const [[[response]]] = await connection.query(q, [userId, postId]);
            return response;
        } catch (err) {
            throw err;
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
            throw err;
        }
    }
}
