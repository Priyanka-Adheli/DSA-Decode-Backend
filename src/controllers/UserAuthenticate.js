const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require("../config/redis");
const validate = require('../utils/validator');

require('dotenv').config();

const key = process.env.SECERT_KEY;


const register = async(req,res)=>{
    try{
       
        // Validate the user data
        validate(req.body);

        // Hash the password
        req.body.password = await bcrypt.hash(req.body.password,10);


        // Insert the valid data
        const user = await User.create(req.body);

        // Create an token
        const token = jwt.sign({id:user._id,email:user.email,name:user.firstName,role:user.role},key,{expiresIn:3600});

        // Add the token to cookies
        res.cookie("token",token,{maxAge:60*60*1000});

        // Send response to the user
        // res.status(201).send(user);

        // send reply
        const reply = {
            firstName: user.firstName,
            email: user.email,
            _id: user._id,
            role:user.role,
        }

        // Send response to the user
          res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(400).json({error:err});
    }
}

const login = async(req,res)=>{

    try{
        const {email,password} = req.body;

        if(!email || !password)
            throw new Error("Invalid Credentials");

        // find email Id in Database
        const user = await User.findOne({email:email});

        // If EmailId not present 
        if(!user)
            throw new Error("Invalid Credentials");

        // validate the password
        const isVaildPassword = await bcrypt.compare(password,user.password)
        
        if(!isVaildPassword)
            throw new Error("Email Id or Password doesnt match with each other");

        // Create an token
        const token = jwt.sign({id:user._id,email:user.email,name:user.firstName,role:user.role},key,{expiresIn:3600});

        // Add the token to cookies
        res.cookie("token",token,{maxAge:60*60*1000});

        // Send response to the user
        // res.status(201).send(user);

        // send reply
        const reply = {
            firstName: user.firstName,
            email: user.email,
            _id: user._id,
            role:user.role,
        }

        // Send response to the user
          res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        });
    }
    catch(err)
    {
        res.status(400).send("Error "+ err);
    }
}

const logout = async(req,res)=>{
    try{
        // Validate the token done using middleware

        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);

        // Empty the cookies
        res.cookie("token",null,{maxAge:new Date(Date.now())});

        res.send("Logged Out successfully");
    }
    catch(err)
    {
        res.status(400).send("Error "+err);
    }
}

const getProfile = async(req,res)=>{
    try{
    const {token} = req.cookies;

    const payload = jwt.verify(token,key);

    const user = await User.findById({_id:payload.id});

    res.send(user);
    }
    catch(err)
    {
        res.status(400).send("Error "+err);  
    }

}

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    res.status(200).send("Deleted Successfully");
    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}
module.exports = {register,login,logout,getProfile,deleteProfile};