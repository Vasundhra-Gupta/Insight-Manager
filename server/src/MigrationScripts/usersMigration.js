import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { User } from "../schemas/MongoDB/userSchema.js";
import { BAD_REQUEST, OK } from "../constants/errorCodes.js";

export async function migrateUsers() {
    try {
        const [users] = await connection.query("SELECT * FROM users");
        console.log(users);

        if (users.length) {
            // const transformedCategories = users.map((user) => ({
            //     category_id: category.category_id,
            //     category_name: category.category_name,
            // }));

            const result = await User.insertMany(users, { ordered: false });
            console.log(result);
            return res.status(OK).json({ message: "USERS_MIGRATED_SUCCESSFULLY" });
        } else {
            return res.status(OK).json({ message: "NO_USERS_TO_MIGRATE" });
        }
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            message: "something went wrong while migrating users",
            error: err.message,
        });
    }
}
