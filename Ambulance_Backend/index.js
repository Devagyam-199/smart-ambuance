const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db_connection_user')
const User_Auth_Router = require('./Routes/User_Auth_Router')
const cors=require('cors')
const bodyParser = require('body-parser')


const PORT = process.env.PORT || 8080;
app.get(`/ping`,(req,res)=>(
    res.send(`tum sarvaiya`)
))

app.use(bodyParser.json())
app.use(cors({
    origin: "https://resqride.netlify.app/",  // Allow only your frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use('/user_auth', User_Auth_Router)

app.listen(PORT, ()=>(
    console.log(`server running of ${PORT}`)
)) 