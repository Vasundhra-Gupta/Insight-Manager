import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { Category } from "../schemas/MongoDB/categorySchema.js";
import { BAD_REQUEST, OK } from "../constants/errorCodes.js";

export async function migrateCategories() {
    try {
        const [categories] = await connection.query("SELECT * FROM categories"); // ⭐ could think of limit (pagination concept as app scales)
        console.log(categories);

        if (categories.length) {
            const transformedCategories = categories.map((category) => ({
                category_id: category.category_id,
                category_name: category.category_name,
            }));

            const result = await Category.insertMany(transformedCategories, { ordered: false });
            console.log(result);
            return res.status(OK).json({ message: "CATEGORIES_MIGRATED_SUCCESSFULLY" });
        } else {
            return res.status(OK).json({ message: "NO_CATEGORIES_TO_MIGRATE" });
        }
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            message: "something went wrong while migrating categories",
            error: err.message,
        });
    }
}
