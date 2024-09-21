import { MySQLusers } from "../models/userModel.js";
export default function getServiceObject(serviceType){
    if (process.env.DATABASE_TYPE=="mysql"){
        switch(serviceType){
            case "user":
                return new MySQLusers();
            // case "blogs":
            //     return new MySQLblogs();
            default:
                throw new Error("Unsupported service type");
        }
    } else if (process.env.DATABASE_TYPE=="mongoDB"){
        switch(serviceType){
            case "user":
                return new MongoDBusers();
            // case "blogs":
            //     return new MySQLblogs();
            default:
                throw new Error("Unsupported service type");
        }
    } else {
        throw new Error("Unsupported Database Type");
    }
}
