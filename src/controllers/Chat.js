const express = require("express");
const dotenv = require("dotenv");
const ChatData = require("../models/ChatModel");
const {GoogleGenAI} = require("@google/genai");
// Configure the .env file
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// Router (api endpoint to send message/prompt)
const sendMessage = async(req,res)=>{
    const userId = req.result._id;
    const {text} = req.body;
    if(!text)
        return res.status(400).send("Missing text");

    try{

        // Since each user has one doc find the doc
        let userDoc = await ChatData.findOne({userId});

        if(!userDoc)
        {
            userDoc = new ChatData({
                userId,
                chatMessages : [{title:"New Chat",messages:[]}],
            });
        }

        const lastChat = userDoc.chatMessages[userDoc.chatMessages.length-1];

        // add the user message in messages array
        lastChat.messages.push({role:"user",text});

        // Generate the AI Response by giving the history (for context) and systemInstructions
        const chatSession = ai.chats.create({
            model:"gemini-2.0-flash",
            config:{
            systemInstruction: `You are an expert DSA (Data Structures & Algorithms) instructor. Your role is to teach and guide learners from beginner to advanced level using bite-sized, easy-to-understand explanations.

Respond in a friendly and clear manner. Break down complex topics visually when possible and provide dry-run style walkthroughs for examples.

For each problem, offer:

Step-by-step solution

Time and space complexity analysis

Pattern recognition where applicable

 Support topics include:
Arrays, Linked Lists, Trees, Graphs, Recursion, Dynamic Programming, Greedy Algorithms, Backtracking, Hashing, Heaps, and more.

Fluent in both English and Hindi (Hinglish-style), explain using whichever improves understanding.

If a question is off-topic (not related to DSA), respond politely as Please ask the DSA Related Contents`,
   maxOutputTokens: 500,
      temperature: 0.1,
},
history: lastChat.messages.map(m=>({
    role:m.role,
    parts: [{text:m.text}],
})),
    });

    // Get the response
    const response = await chatSession.sendMessage({message:text});
    const aiText = response.candidates[0].content.parts[0].text;

    // Add the AI response to messages array
    lastChat.messages.push({role:"model",text:aiText});

    // Update chat title in case of first message
    if(lastChat.messages.length===2)
    {
        lastChat.title= text.substring(0,30);
    }

    await userDoc.save();
    res.status(201).json({reply:aiText});
    }
    catch(err)
    {
        res.status(500).send("failed to process message");
        console.log("Error "+err.message);
    }
}

// Router to get all chats
const getAllChats = async(req,res)=>{
    try{
        const userId = req.result._id;
        const userDoc = await ChatData.findOne({userId});

        res.status(200).json({chatMessages:userDoc?.chatMessages|| []});
    }
    catch(err)
    {
        res.status(500).json("Failed to load the chats");
        console.log("Error "+err.message);
    }
};

// To create the new chat session
const newChat = async(req,res)=>{
    try{
        const userId = req.result._id;
        let userDoc = await ChatData.findOne({userId});

        if(!userDoc)
        {
            userDoc = new ChatData({userId,chatMessages:[]});
        }

        userDoc.chatMessages.push({title:"New Chat",messages:[]});
        await userDoc.save();

        res.status(201).json(userDoc);
    }
    catch(err)
    {
        res.status(500).json("Failed to create new chat session");
        console.log("Error "+err.message);
    }
};

module.exports = {sendMessage,getAllChats,newChat};