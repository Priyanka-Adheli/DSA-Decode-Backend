// const express = require("express");
// const dotenv = require("dotenv");
// const router = express.Router();
// const ChatData = require("../models/ChatModel");
// const {GoogleGenAI} = require("@google/genai");
// // Configure the .env file
// dotenv.config();

// const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// // Router (api endpoint to send message/prompt)
// router.post("/send",async(req,res)=>{

//     const {userId,text} = req.body;

//     if(!userId || !text)
//         return res.status(400).send("Missing userId or text");

//     try{

//         // Since each user has one doc find the doc
//         let userDoc = await ChatData.findOne({userId});

//         if(!userDoc)
//         {
//             userDoc = new ChatData({
//                 userId,
//                 chatMessages : [{title:"New Chat",messages:[]}],
//             });
//         }

//         const lastChat = userDoc.chatMessages[userDoc.chatMessages.length-1];

//         // add the user message in messages array
//         lastChat.messages.push({role:"user",text});

//         // Generate the AI Response by giving the history (for context) and systemInstructions
//         const chatSession = ai.chats.create({
//             model:"gemini-2.0-flash",
//             config:{
//             systemInstruction: `
// You are Rohit Negi, a passionate coder and educator.

// - You graduated from IIT Guwahati.
// - In 2021, you received the highest placement offer in India — over ₹2 crore.
// - You worked at Uber for 9 months before leaving to focus on teaching and content creation.
// - You run a YouTube channel named "Rohit Negi" and another popular one called "Coder Army" wherein you have thought DSA,currently GEN AI.
// - Coder Army is on a mission to create the best coders in India by providing top-quality content.
// - You got AIR 202 in GATE CSE 2020.
// - You currently teach MERN Stack and Blockchain in a paid course every night at 9PM.
// - You also run a Generative AI series every Saturday at 12PM.
// - Your website is https://www.coderarmy.in/
// - Your birthday is on June 9, and you are currently 30 years old.
// - Your interests include coding, fitness, playing cricket, and reading novels.

//  You answer questions only related to:
// - DSA (Data Structures & Algorithms)
// - MERN Stack
// - GATE CSE preparation
// - GEN AI

// Coder Army Youtube Channel Link
// https://youtube.com/@coderarmy9?si=TYBz-QHkizu627SF

// Rohit Negi Youtube Channel Link
// https://youtube.com/@rohit_negi?si=-B5zQwjDfhnTDUvE

// GATE Preparation or GATE Relate Link
// https://youtu.be/u0e_-64w5kM?si=L1KNjU2tUrTLNGVj

// How you cracked 2 crore package or any question related to it link
// https://youtu.be/oxp0Gojn3p8?si=8isLQkLCINMoAUup

//  You speak in Hindi-English mix (Hinglish) in a friendly, motivational tone.

// If someone asks about any other topic, politely reply with:  
// Mujhe is topic ke baare mein pata nahi hai, aap mujhse DSA, MERN Stack,GEN AI ya GATE se related kuch bhi pooch sakte ho.
//   Also you can use the emojis if necessary`,
//    maxOutputTokens: 500,
//       temperature: 0.1,
// },
// history: lastChat.messages.map(m=>({
//     role:m.role,
//     parts: [{text:m.text}],
// })),
//     });

//     // Get the response
//     const response = await chatSession.sendMessage({message:text});
//     const aiText = response.candidates[0].content.parts[0].text;

//     // Add the AI response to messages array
//     lastChat.messages.push({role:"model",text:aiText});

//     // Update chat title in case of first message
//     if(lastChat.messages.length===2)
//     {
//         lastChat.title= text.substring(0,30);
//     }

//     await userDoc.save();
//     res.status(201).json({reply:aiText});
//     }
//     catch(err)
//     {
//         res.status(500).send("failed to process message");
//         console.log("Error "+err.message);
//     }
// });

// // Router to get all chats
// router.get("/",async(req,res)=>{
//     try{
//         const {userId} = req.query;
//         const userDoc = await ChatData.findOne({userId});

//         res.status(200).json({chatMessages:userDoc?.chatMessages|| []});
//     }
//     catch(err)
//     {
//         res.status(500).json("Failed to load the chats");
//         console.log("Error "+err.message);
//     }
// });

// // To create the new chat session
// router.post("/new",async(req,res)=>{
//     try{
//         const {userId} = req.body;
//         let userDoc = await ChatData.findOne({userId});

//         if(!userDoc)
//         {
//             userDoc = new ChatData({userId,chatMessages:[]});
//         }

//         userDoc.chatMessages.push({title:"New Chat",messages:[]});
//         await userDoc.save();

//         res.status(201).json(userDoc);
//     }
//     catch(err)
//     {
//         res.status(500).json("Failed to create new chat session");
//         console.log("Error "+err.message);
//     }
// });

// module.exports = router;


const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const { sendMessage, getAllChats, newChat } = require("../controllers/Chat");
const chatRouter = express.Router();

chatRouter.post("/send",userMiddleware,sendMessage);
chatRouter.get("/",userMiddleware,getAllChats);
chatRouter.post("/new",userMiddleware,newChat);

module.exports = chatRouter;