import mysql from "mysql2/promise";
import Logger from "@/app/lib/logger";
import Schema from "@/app/lib/db/schema";

const dbLogger = new Logger('Database');
let pool: mysql.Pool;

const createPool = async () => {
    if (!pool) {
      dbLogger.wait("Connecting to database...");
      try {
        pool = mysql.createPool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        });
        dbLogger.wait("Loading database schema...");
        await Schema(pool);
        dbLogger.success("Successfully connected to database.");
      } catch (error) {
        dbLogger.error("Error creating database pool:", error);
      }
      await pool.query(`USE ${process.env.DB_NAME}`)
    } 
    return pool; 
};

export default createPool;