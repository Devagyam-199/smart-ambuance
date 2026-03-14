import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const connector = await mongoose.connect(process.env.MONGO_CONN_URL);
    console.log("connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnection;
