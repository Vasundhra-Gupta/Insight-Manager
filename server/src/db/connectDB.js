import mysql from "mysql2";
import mongoose from "mongoose";

class DBConnection {
    constructor() {
        this.connection = null;
        this.mongoClient = null;
    }

    static getInstance() {
        if (!DBConnection.Instance) {
            DBConnection.Instance = new DBConnection();
        }
        return DBConnection.Instance;
    }

    connect = async () => {
        try {
            if (!this.connection) {
                switch (process.env.DATABASE_TYPE) {
                    case "SQL": {
                        await this.connectMYSQL();
                        break;
                    }
                    case "MongoDB": {
                        await this.connectMongoDB();
                        break;
                    }
                    default: {
                        throw new Error("Unsupported Database Type");
                    }
                }
            }
            return this.connection;
        } catch (err) {
            return console.log("Didn't connected to the database.", err.message);
        }
    };

    async connectMYSQL() {
        try {
            this.connection = mysql
                .createPool({
                    host: process.env.MYSQL_HOST,
                    user: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASSWORD,
                    database: process.env.MYSQL_DATABASE_NAME,
                })
                .promise();

            // Testing the connection
            const conn = await this.connection.getConnection();
            console.log(`Connected to mysql successfully, host: ${conn.config.host}`);
            conn.release();
        } catch (err) {
            return console.log("mysql didn't connected !!", err);
        }
    }

    async connectMongoDB() {
        try {
            this.connection = await mongoose.connect(
                `${process.env.MONGODB_URL}${process.env.MONGODB_DB_NAME}`
            );
            console.log(
                `Connected to mongodb successfully, host: ${this.connection.connection.host}`
            );
        } catch (err) {
            return console.log("mongodb didn't connected !!", err);
        }
    }
}

export const dbInstance = DBConnection.getInstance();
