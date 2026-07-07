import mongoose from "mongoose";

const databaseConnection = async (DATABASE_URL, DATABASE_NAME) => {
    try {
        const DB_OPTIONS = {
            dbName: DATABASE_NAME,
        };
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Database Connected Successfully...");
    } catch (error) {
        console.error("Database Connection Failed");
        console.error(error);
        throw error;
    }
};

export default databaseConnection;