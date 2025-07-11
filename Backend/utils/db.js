import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDb connected successfully");
  } catch (err) {
    console.log("Error while Connecting...", err)
  }
}

export default connectDB;