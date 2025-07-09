const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const main = require("./config/DB");
const authRouter = require("./routes/userAuth");
const chatRouter = require("./routes/ChatRoute");
const redisClient = require("./config/redis");
const cookieParser = require('cookie-parser');


// Configure the .env file
dotenv.config();

// Create the server
const app = express();

// app.use(cors({
//     origin: 'https://dsa-decode-frontend-4a6x.vercel.app',
//     credentials: true 
// }));

const allowedOrigins = [
  'http://localhost:5173',
  'https://dsa-decode-frontend-4a6x.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());  //for parsing

app.use("/user",authRouter);
app.use("/ai/chats",chatRouter);



const InitializeComponent = async()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("Connected to Database");
        
        app.listen(5000,()=>{
        console.log("Server is Listening");
    });
    }
    catch(err)
    {
        console.log("Error "+err);
    }
}

InitializeComponent();
