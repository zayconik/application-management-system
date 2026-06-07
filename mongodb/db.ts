import mongoose from "mongoose"

const connectionString = process.env.MONGO_DB_URI;

if (!connectionString) {
  throw new Error('Please define the MONGO_DB_URI environment variable inside .env.local');
}

const connectDB = async () => {
    if (mongoose.connection?.readyState >= 1) {
        return;
    }

    try {
        console.log("Connecting to MongoDB");
        await mongoose.connect(connectionString, {
            dbName: process.env.MONGO_DB_NAME || undefined,
        });
        console.log(`Connected to MongoDB (${mongoose.connection.name})`);
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        throw error;
    }
}

export default connectDB;