import { connection } from "../server.js";
import { WatchHistory } from "../schemas/MongoDB/userSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migrateWatchHistory(){
    try{
        const [SQLwatchHistory] = await connection.query("SELECT * FROM watch_history");
        const SQLwatchHistoryKeys = SQLwatchHistory.map((w)=> `${w.post_id} ${w.user_id}`);

        if(SQLwatchHistory.length){
            const [MongoDBwatchHistory] = await WatchHistory.find()
            const MongoDBwatchHistoryKeys = MongoDBwatchHistory.map((w)=> `${w.post_id} ${w.user_id}`);

            const newWatchHistory= [];

            for(let post in SQLwatchHistory){
                const key = `${post.post_id} ${post.user_id}`
                if(!MongoDBwatchHistoryKeys.includes(key)){
                    newWatchHistory.push(post);
                }
            }

            const deletedWatchHistory = MongoDBwatchHistory.filter((w)=>{
                const key= `${w.post_id} ${w.user_id}`
                return !SQLwatchHistoryKeys.includes(key);
            })

            if(newWatchHistory.length){
                await WatchHistory.insertMany(newWatchHistory);
            }

            if(deletedWatchHistory.length){
                deleteFilters = deletedWatchHistory.map((w)= ({
                    post_id : w.post_id,
                    user_id : w.post_id
                }))
                await WatchHistory.deleteMany({$or : deleteFilters})
            }

            console.log(`${newWatchHistory.length} NEW WATCH HISTORY POSTS INSERTED \n ${deletedWatchHistory.length} WATCH HISTORY POSTS DELETED`)
            
        }else{
            const count = await WatchHistory.countDocuments();
            if(count){
                await WatchHistory.deleteMany();
                console.log("CLEARED MONGPDB WATCHHISTORY")
            }else{
                console.log("NO POSTS TO MIGRATE IN WATCH HISTORY")
            }
        }
        next();
    }catch(err){
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating watch history.",
            error: err.message
        })
    }
}