import { connection } from '../server.js'; // still has SQL connection in this connection variable.
import { Category } from '../schemas/MongoDB/categorySchema.js';
import { SERVER_ERROR } from '../constants/errorCodes.js';

export async function migrateCategories(req, res, next) {
    try {
        // Fetch all categories from SQL
        const [SQLcategories] = await connection.query(
            'SELECT * FROM categories'
        ); // ⭐ could think of limit (pagination concept as app scales)
        console.log(SQLcategories);

        if (SQLcategories.length) {
            const SQLcategoryIds = SQLcategories.map(
                (category) => category.category_id
            );

            // Fetch all existing categories from MongoDB
            const MongoDBcategories = await Category.find();
            const MongoDBcategoryIds = MongoDBcategories.map(
                (c) => c.category_id
            );

            const newCategories = [];
            const updatedCategories = [];

            // 1. Find new & updated records
            for (let category of SQLcategories) {
                if (!MongoDBcategoryIds.includes(category.category_id)) {
                    // new category
                    newCategories.push(category);
                } else {
                    // If exists, compare
                    const existingMongoCategory = MongoDBcategories.find(
                        (c) => c.category_id === category.category_id
                    );
                    if (
                        existingMongoCategory &&
                        existingMongoCategory.category_name !==
                            category.category_name
                    ) {
                        // If different, push to updatedCategories array
                        updatedCategories.push(category);
                    }
                }
            }

            // 2. Find deleted records (records in MongoDB but not in SQL)
            const deletedCategories = MongoDBcategories.filter(
                (c) => !SQLcategoryIds.includes(c.category_id)
            );

            // 3. Insert
            if (newCategories.length > 0) {
                await Category.insertMany(newCategories);
            }

            // 4. Update (bulk update)
            if (updatedCategories.length > 0) {
                const bulkOptions = updatedCategories.map((c) => ({
                    updateOne: {
                        filter: {
                            category_id: c.category_id,
                        },
                        update: {
                            $set: {
                                category_name: c.category_name,
                            },
                        },
                    },
                }));
                await Category.bulkWrite(bulkOptions);
            }

            // 5. Delete
            if (deletedCategories.length > 0) {
                const deletedCategoriesIds = deletedCategories.map(
                    (c) => c.category_id
                );
                await Category.deleteMany({
                    category_id: {
                        $in: deletedCategoriesIds,
                    },
                });
            }

            console.log(
                `${newCategories.length} new CATEGORIES INSERTED.\n${updatedCategories.length} CATEGORIES UPDATED.\n${deletedCategories.length} CATEGORIES DELETED.\n`
            );
        } else {
            const count = await Category.countDocuments();
            if (count) {
                await Category.deleteMany();
                console.log('CLEARED MONGODB CATEGORIES\n');
            } else {
                console.log('NO_CATEGORIES_TO_MIGRATE');
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while migrating categories',
            error: err.message,
        });
    }
}
