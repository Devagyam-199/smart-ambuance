import globalError from "./Utils/globalErrorHandler.utils.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());





/************************** last line of code **************************/


app.use(globalError);
export default app;