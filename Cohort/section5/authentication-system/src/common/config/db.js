import mongoose from "mongoose";

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URL);
  console.log("MongoDB is connected sucessfully", conn.connection.host);
};

export default connectDB;
