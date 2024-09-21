import { Iusers } from "../interfaces/userInterface.js"
import { connection } from "../server.js"

export class MySQLusers extends Iusers {
    async getUsers() {
        try {
            const [result] = await connection.query("SELECT * FROM users")
            return result
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async getUser(id) {
        try {
            // if(id!valid)
            const [[result]] = await connection.query(
                "SELECT * FROM users WHERE user_id = ?",
                [id]
            )
            if (result) return result
            else return { message: "USER_NOT_FOUND" }
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteUsers() {
        try {
            // return await connection.query("TRUNCATE TABLE users");
            return await connection.query("DELETE FROM users")
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteUser(id) {
        try {
            const q = "DELETE FROM users WHERE user_id = ?"
            const [result] = await connection.query(q, [id])
            console.log(result.affectedRows)
            if (result.affectedRows == 0) {
                return { success: false, message: "user not deleted" }
            } else {
                return { success: true, message: "deletion successfull" }
            }
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async createUser(
        id,
        name,
        firstName,
        lastName,
        avatar,
        coverimage,
        email,
        password
    ) {
        try {
            await connection.query(
                "INSERT INTO users(user_id, user_name, user_firstName, user_lastName, user_avatar, user_coverImage, user_email, user_password) VALUES (?,?,?,?,?,?,?,?)",
                [
                    id,
                    name,
                    firstName,
                    lastName,
                    avatar,
                    coverimage,
                    email,
                    password,
                ]
            )
            const result = this.getUser(id)
            if (result) return result
            else return { message: "user not created" }
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async editUser(
        id,
        name,
        firstName,
        lastName,
        avatar,
        coverimage,
        email,
        password
    ) {
        try {
            await connection.query(
                "UPDATE users SET user_name = ?, user_firstname=?, user_lastname=?, user_avatar=?, user_coverImage=?, user_email=?, user_password=? WHERE user_id= ?",
                [
                    name,
                    firstName,
                    lastName,
                    avatar,
                    coverimage,
                    email,
                    password,
                    id,
                ]
            )
            const result = this.getUser(id)
            if (result) return result
        } catch (err) {
            throw new Error(err.message)
        }
    }
}
