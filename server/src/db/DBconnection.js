import mysql from "mysql2";

class DBConnection {
  constructor() {
    this.connection = null;
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
        if (process.env.DATABASE_TYPE === "mysql") {
          this.connection = mysql
            .createPool({
              host: process.env.MYSQL_HOST,
              user: process.env.MYSQL_USER,
              password: process.env.MYSQL_PASSWORD,
              database: process.env.MYSQL_DATABASE,
            })
            .promise();
          const conn = await this.connection.getConnection();
          console.log(
            `Connected to sql database successfully , port: ${conn.config.host}`
          );
          conn.release();
        } else {
          throw new Error("Unsupported Database Type");
        }
      }
    } catch (err) {
      console.log("Didn't connected to the database.", err);
    }
    return this.connection;
  };
}

export const dbInstance = DBConnection.getInstance();
