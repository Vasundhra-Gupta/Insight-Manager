import { connection } from '../server.js';
import { SERVER_ERROR } from '../constants/errorCodes.js';
import { SavedPost } from '../schemas/MongoDB/userSchema.js';

export async function migrateSavedPosts(req, res, next) {
    try {
        // SQL saved posts
        const [SQLsavedPosts] = await connection.query(
            'SELECT * FROM saved_posts'
        );
        console.log(SQLsavedPosts);
        if (SQLsavedPosts.length) {
            // SQL saved posts keys
            const SQLsavedPostKeys = SQLsavedPosts.map(
                (p) => `${p.post_id} ${p.user_id}`
            );

            // MongoDB saved posts
            const MongoDBsavedPosts = await SavedPost.find();
            console.log(MongoDBsavedPosts);
            // MongoDB saved posts keys
            const MongoDBsavedPostKeys = MongoDBsavedPosts.map(
                (p) => `${p.post_id} ${p.user_id}`
            );

            const newSavedPosts = [];

            //find records to Insert
            for (let savedPost of SQLsavedPosts) {
                const key = `${savedPost.post_id} ${savedPost.user_id}`;
                if (!MongoDBsavedPostKeys.includes(key)) {
                    newSavedPosts.push(savedPost);
                }
            }

            //find records to Delete
            const deletedSavedPosts = MongoDBsavedPosts.filter((p) => {
                const key = `${p.post_id} ${p.user_id}`;
                return !SQLsavedPostKeys.includes(key);
            });

            //Insert
            if (newSavedPosts.length) {
                await SavedPost.insertMany(newSavedPosts);
            }

            //Delete
            if (deletedSavedPosts.length) {
                const deleteFilters = deletedSavedPosts.map((p) => ({
                    post_id: p.post_id,
                    user_id: p.user_id,
                }));
                await SavedPost.deleteMany({
                    $or: deleteFilters,
                });
            }

            console.log(
                `${newSavedPosts.length} new SAVEDPOSTS INSERTED.\n${deletedSavedPosts.length} SAVEDPOSTS DELETED.`
            );
        } else {
            const count = SavedPost.countDocuments();
            if (count) {
                await SavedPost.deleteMany();
                console.log('CLEARED MONGODB SAVEDPOSTS');
            } else {
                console.log('NO_SAVEDPOSTS_TO_MIGRATE');
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while migrating saved posts',
            error: err.message,
        });
    }
}
