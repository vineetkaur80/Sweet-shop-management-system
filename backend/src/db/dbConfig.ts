// // const mongoose = require("mongoose");
// import mongoose from "mongoose";

// const connectDatabase = async () => {
//   try {
//     console.log("dbUri:", process.env.MONGO_URI);
//     const uri = process.env.MONGO_URI;
//     if (!uri) {
//       throw new Error("MONGO_URI environment variable is not defined");
//     }
//     const connectionInstance = await mongoose.connect(uri);

//     console.log(
//       `✅ MongoDB connected! Host: ${connectionInstance.connection.host}`
//     );
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error);
//     process.exit(1);
//   }
// };

// // module.exports = connectDatabase;
// export default connectDatabase;


import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error; // Let tests handle the error
  }
};
