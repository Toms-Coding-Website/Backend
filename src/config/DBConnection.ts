import mongoose from "mongoose";
const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.once("open", () => {
      console.log("[server] Connected to MongoDB successfully");
    });
  } catch (error) {
    console.log("[server] " + error.message);
    process.exit(-1);
  }
};

export default connectDB;
