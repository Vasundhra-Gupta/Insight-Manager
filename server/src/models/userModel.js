import { Iusers } from "../interfaces/userInterface.js";
import { connection } from "../server.js";
import validator from "validator";

export class SQLusers extends Iusers {
    async getUser(searchInput) {
        try {
            let q;
            if (validator.isEmail(searchInput)) {
                q = "SELECT * FROM users WHERE user_email = ?";
            } else if (validator.isUUID(searchInput)) {
                q = "SELECT * FROM users WHERE user_id = ?";
            } else {
                q = "SELECT * FROM users WHERE user_name = ?";
            }

            const [[user]] = await connection.query(q, [searchInput]);

            if (user) return user;
            else return { message: "USER_NOT_FOUND" };
        } catch (err) {
            throw new Error(err);
        }
    }

    async createUser(id, userName, firstName, lastName, avatar, coverImage, email, password) {
        try {
            const q = "INSERT INTO users (user_id, user_name, user_firstName, user_lastName, user_avatar, user_coverImage, user_email, user_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            await connection.query(q, [id, userName, firstName, lastName, avatar, coverImage, email, password]);

            const user = await this.getUser(id);

            if (user?.message) {
                throw new Error({ message: "USER_CREATION_DB_ISSUE" });
            } else {
                const { user_password, ...createdUser } = user; // to exclude the password from the response
                return createdUser;
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async deleteUser(id) {
        try {
            const user = await this.getUser(id);
            if (user?.message) {
                throw new Error(user.message);
            } else {
                const q = "DELETE FROM users WHERE user_id = ?";

                const [result] = await connection.query(q, [id]);

                if (result.affectedRows == 0) {
                    throw new Error({ message: "USER_DELETION_DB_ISSUE" });
                }
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async logoutUser(id) {
        try {
            const q = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
            await connection.query(q, ["", id]);
            const user = await this.getUser(id);
            if (user?.refresh_token !== "") {
                throw new Error({ message: "REFRESH_TOKEN_NOT_DELETED_IN_DB" });
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateTokens(id, refreshToken) {
        try {
            const q = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
            await connection.query(q, [refreshToken, id]);
            const user = await this.getUser(id);
            if (user?.refresh_token === "") {
                throw new Error({ message: "REFRESH_TOKEN_NOT_SAVED_IN_DB" });
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateAccountDetails(id, firstName, lastName, email, password) {
        try {
            const q = "UPDATE users SET user_name=?, user_email=? WHERE user_id= ?";

            await connection.query(q, [userName, email, id]);

            const result = await this.getUser(id);

            if (result) return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async updateChannelDetails(id, userName, bio, password) {
        try {
            const q = "UPDATE users SET user_firstname=?, user_lastname=? WHERE user_id= ?";

            await connection.query(q, [firstName, lastName, id]);

            const result = this.getUser(id);

            if (result) return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async updatePassword(id, oldPassword, newPassword) {
        try {
            const q = "UPDATE users SET user_password=? WHERE user_id= ?";

            await connection.query(q, [newPassword, id]);

            const result = this.getUser(id);

            if (result) return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async updateAvatar(id, avatar) {
        try {
            const q = "UPDATE users SET user_password=? WHERE user_id= ?";

            await connection.query(q, [newPassword, id]);

            const result = this.getUser(id);

            if (result) return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async updateCoverImage(id, coverImage) {
        try {
            const q = "UPDATE users SET user_password=? WHERE user_id= ?";

            await connection.query(q, [newPassword, id]);

            const result = this.getUser(id);

            if (result) return result;
        } catch (err) {
            throw new Error(err.message);
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
