export class Iusers {
    async getUsers() {
        throw new Error("Method getUsers not overwritten.")
    }

    async getUser(id) {
        throw new Error("Method getUser not overwritten.")
    }

    async deleteUsers() {
        throw new Error("Method deleteUsers not overwritten.")
    }

    async deleteUser(id) {
        throw new Error("Method deleteUser not overwritten.")
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
        throw new Error("Method createUsers not overwritten.")
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
        throw new Error("Method editUser not overwritten.")
    }
}
