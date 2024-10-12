import { Iusers } from "../interfaces/userInterface.js";
import { connection } from "../server.js";
import validator from "validator";

export class SQLusers extends Iusers {
    async getUser(searchInput) {
        try {
            // let q;
            // if (validator.isEmail(searchInput)) {
            //     q = "SELECT * FROM users WHERE user_email = ?";
            // } else if (validator.isUUID(searchInput)) {
            //     q = "SELECT * FROM users WHERE user_id = ?";
            // } else {
            //     q = "SELECT * FROM users WHERE user_name = ?";
            // }

            // const [[user]] = await connection.query(q, [searchInput]);

            // if (!user) {
            //     return { message: "USER_NOT_FOUND" };
            // }

            // using PL/SQL Procedures
            let q;
            if (validator.isEmail(searchInput)) {
                q = "CALL getUser('email',?)";
            } else if (validator.isUUID(searchInput)) {
                q = "CALL getUser('uuid',?);";
            } else {
                q = "CALL getUser('username',?);";
            }

            const [[[user]]] = await connection.query(q, [searchInput]);

            return user;
        } catch (err) {
            throw err;
        }
    }

    async createUser(userId, userName, firstName, lastName, avatar, coverImage, email, password) {
        try {
            const q =
                "INSERT INTO users (user_id, user_name, user_firstName, user_lastName, user_avatar, user_coverImage, user_email, user_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            await connection.query(q, [
                userId,
                userName,
                firstName,
                lastName,
                avatar,
                coverImage,
                email,
                password,
            ]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "USER_CREATION_DB_ISSUE" });
            }
            const { refresh_token, ...createdUser } = user; // to exclude the password from the response
            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            const q = "DELETE FROM users WHERE user_id = ?";

            const [result] = await connection.query(q, [userId]);

            if (result.affectedRows === 0) {
                throw new Error({ message: "USER_DELETION_DB_ISSUE" });
            }
        } catch (err) {
            throw err;
        }
    }

    async logoutUser(userId) {
        try {
            const q = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
            await connection.query(q, ["", userId]);

            const user = await this.getUser(userId);

            if (user?.refresh_token !== "") {
                throw new Error({ message: "REFRESH_TOKEN_NOT_DELETED_IN_DB" });
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    async updateRefreshToken(userId, refreshToken) {
        try {
            const q = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
            await connection.query(q, [refreshToken, userId]);
            const user = await this.getUser(userId);
            if (user?.refresh_token === "") {
                throw new Error({ message: "REFRESH_TOKEN_NOT_SAVED_IN_DB" });
            }
        } catch (err) {
            throw err;
        }
    }

    async getChannelProfile(channelId, currentUserId) {
        try {
            let isFollowed = false;
            const q1 =
                "SELECT COUNT(*) AS isFollowed FROM followers where following_id = ? AND follower_id = ? "; // either 0 or 1
            if (currentUserId) {
                const [[response1]] = await connection.query(q1, [channelId, currentUserId]);
                if (response1.isFollowed) {
                    isFollowed = true;
                }
            }

            const q = "SELECT * FROM channel_view WHERE user_id = ?";
            const [[response]] = await connection.query(q, [channelId]);
            if (!response) {
                throw new Error({ message: "CHANNEL_FETCHING_DB_ISSUE" });
            }

            return { ...response, isFollowed };
        } catch (err) {
            throw err;
        }
    }

    async updateAccountDetails(userId, firstName, lastName, email) {
        try {
            const q =
                "UPDATE users SET user_firstName=?, user_lastName = ?, user_email=? WHERE user_id= ?";

            await connection.query(q, [firstName, lastName, email, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "ACCOUNT_DETAILS_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateChannelDetails(userId, userName, bio) {
        try {
            const q = "UPDATE users SET user_name=?, user_bio=? WHERE user_id= ?";

            await connection.query(q, [userName, bio, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "PROFILE_DETAILS_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            const q = "UPDATE users SET user_password = ? WHERE user_id = ?";

            await connection.query(q, [newPassword, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "PASSWORD_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user; // we dont show password anywhere (no need to return though)
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            const q = "UPDATE users SET user_avatar = ? WHERE user_id = ?";

            await connection.query(q, [avatar, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "AVATAR_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateCoverImage(userId, coverImage) {
        try {
            const q = "UPDATE users SET user_coverImage=? WHERE user_id= ?";

            await connection.query(q, [coverImage, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "COVERIMAGE_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
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
            throw err;
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
            throw err;
        }
    }

    async updateWatchHistory(postId, userId) {
        try {
            const q = `CALL updateWatchHistory (?, ?)`;
            const [[[response]]] = await connection.query(q, [postId, userId]);
            return response;
        } catch (err) {
            throw err;
        }
    }

    // async deleteUsers() {
    //     try {
    //         // const q = "TRUNCATE TABLE users";   // good error
    //         const q = "DELETE FROM users"

    //         return await connection.query(q)
    //     } catch (err) {
    //         throw new Error(err.message)
    //     }
    // }
}
