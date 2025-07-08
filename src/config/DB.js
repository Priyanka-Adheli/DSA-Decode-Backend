const mongoose = require('mongoose');
const dotenv = require("dotenv");

// Configure the .env file
dotenv.config();

const connectionString = process.env.MONGO_URI;

async function main(){
    await mongoose.connect(connectionString);
}

module.exports = main;