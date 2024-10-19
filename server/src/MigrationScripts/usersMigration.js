import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { User } from "../schemas/MongoDB/userSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migrateUsers(req, res, next) {
    try {
        // Fetch all users from SQL
        const [SQLusers] = await connection.query("SELECT * FROM users");
        console.log(SQLusers);

        if (SQLusers.length) {
            const SQLuserIds = SQLusers.map((u) => u.user_id);

            // Fetch all existing users from MongoDB
            const MongoDBusers = await User.find();
            const MongoDBuserIds = MongoDBusers.map((u) => u.user_id);

            const newUsers = [];
            const updatedUsers = [];

            // 1. Find new & updated records
            for (let user of SQLusers) {
                if (!MongoDBuserIds.includes(user.user_id)) {
                    // new user
                    newUsers.push(user);
                } else {
                    // If exists, compare
                    const existingMongoUser = MongoDBusers.find((u) => u.user_id === user.user_id);

                    if (
                        Object.entries(existingMongoUser).some(
                            ([key, value]) => Object.keys(user).includes(key) && value !== user[key]
                        )
                        // existingMongoUser.user_name !== user.user_name ||
                        // existingMongoUser.user_firstName !== user.user_firstName ||
                        // existingMongoUser.user_lastName !== user.user_lastName ||
                        // existingMongoUser.user_email !== user.user_email ||
                        // existingMongoUser.user_avatar !== user.user_avatar ||
                        // existingMongoUser.user_coverImage !== user.user_coverImage ||
                        // existingMongoUser.refresh_token !== user.refresh_token ||
                        // existingMongoUser.user_bio !== user.user_bio ||
                        // existingMongoUser.user_password !== user.user_password
                    ) {
                        // If different, push to updatedUsers array
                        updatedUsers.push(user);
                    }
                }
            }

            // 2. Find deleted records (records in MongoDB but not in SQL)
            const deletedUsers = await User.find({
                user_id: { $nin: SQLuserIds },
            });

            // 3. Insert
            if (newUsers.length > 0) {
                await User.insertMany(newUsers);
            }

            // 4. Update (bulk update)
            if (updatedUsers.length > 0) {
                const bulkOptions = updatedUsers.map((u) => ({
                    updateOne: {
                        filter: { user_id: u.user_id },
                        update: {
                            $set: {
                                user_name: u.user_name,
                                user_firstName: u.user_firstName,
                                user_lastName: u.user_lastName,
                                user_email: u.user_email,
                                user_avatar: u.user_avatar,
                                user_coverImage: u.user_coverImage,
                                user_password: u.user_password,
                                refresh_token: u.refresh_token,
                                user_bio: u.user_bio,
                            },
                        },
                    },
                }));
                await User.bulkWrite(bulkOptions);
            }

            // 5. Delete
            if (deletedUsers.length > 0) {
                const deletedUsersIds = deletedUsers.map((u) => u.user_id);
                await User.deleteMany({ user_id: { $in: deletedUsersIds } });
            }

            console.log(
                `${newUsers.length} new USERS INSERTED.\n${updatedUsers.length} USERS UPDATED.\n${deletedUsers.length} USERS DELETED.`
            );
        } else {
            const count = await User.countDocuments();
            if (count) {
                await User.deleteMany();
                console.log("CLEARED MONGODB USERS\n");
            } else {
                console.log("NO_USERS_TO_MIGRATE");
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating users",
            error: err.message,
        });
    }
}

// export async function migrateUsers(req, res, next) {
//     try {
//         const [users] = await connection.query("SELECT * FROM users");
//         console.log(users);

//         if (users.length) {
//             const result = await User.insertMany(users);
//             console.log(result);

//             if (result.length) {
//                 console.log("USERS_MIGRATED_SUCCESSFULLY");
//             } else {
//                 throw new Error({ message: "MONGODB_USER_MIGRATION_ISSUE" });
//             }
//         } else {
//             console.log("NO_USERS_TO_MIGRATE");
//         }
//         next();
//     } catch (err) {
//         return res.status(SERVER_ERROR).json({
//             message: "something went wrong while migrating users",
//             error: err.message,
//         });
//     }
// }