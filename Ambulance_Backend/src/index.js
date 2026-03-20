import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '8.8.4.4']);   
import "./config/env.js"
import dbConn from "./Database/dbConn.js";
import { app } from './app.js';


dbConn()
.then(()=>{
    app.listen(process.env.PORT || 3000,(req,res)=>{
        console.log(`Server is running on port ${process.env.PORT || 3000} `);
        console.log(`http://localhost:${process.env.PORT || 3000}`);
    })
})
.catch((err)=>{
    console.error("database connection failed : ",err);
})