import mongoose from "mongoose";

const dbConn = async () => {
  try {
    const connInstance = await mongoose.connect(process.env.MONGOCONN_URL);
    console.log(`Database connected successfully: ${connInstance.connection.host}`);
    console.log("URL being used:", process.env.MONGOCONN_URL)
  } catch (error) {
    console.error("Database connection failed:", error);
    console.log("URL being used:", process.env.MONGOCONN_URL)
    process.exit(1);
  }
};

export default dbConn;