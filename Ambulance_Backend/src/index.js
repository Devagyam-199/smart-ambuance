import app from "./app.js";
import dotenv from "dotenv";
import dbConnection from "./Database/dbConn.js";

dotenv.config();

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 3000, (req, res) => {
      console.log(`Successfull boot of backend server`);
      console.log(`Server is running on port ${process.env.PORT || 8080} `);
      console.log(`http://localhost:${process.env.PORT || 8080}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed : ", err);
  });
