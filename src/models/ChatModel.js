const mongoose = require('mongoose');
const { Schema } = mongoose;
const MessageSchema = require('../models/MessageModel');

const ChatMessageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chatMessages: [
      {
        title: {
          type: String,
          default: 'New Chat',
        },
        messages: [MessageSchema],
      },
    ],
  },
  { timestamps: true }
);

const ChatData = mongoose.model('ChatData', ChatMessageSchema);
module.exports = ChatData;