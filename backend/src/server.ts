import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.error("❌ Fatal Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

console.log("🚀 Starting server...");

// Connect with options to prevent hanging
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    
    app.listen(PORT, () => {
      console.log(`🔥 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    // console.error(err); // Uncomment to see full error stack
    process.exit(1);
  });