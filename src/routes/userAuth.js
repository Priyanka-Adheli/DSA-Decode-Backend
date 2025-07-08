const express = require("express");
const {register,login,logout,getProfile,deleteProfile} = require("../controllers/UserAuthenticate");
const userMiddleware = require("../middleware/userMiddleware");

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.get('/logout',userMiddleware,logout);
authRouter.get('/getProfile',userMiddleware,getProfile);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{
    
    const reply ={
        firstName :req.result.firstName,
        email:req.result.email,
        _id:req.result._id,
        role:req.result.role,
    }

    res.status(200).json({
        user:reply,
        message:"Valid user"
    })
});
module.exports = authRouter;