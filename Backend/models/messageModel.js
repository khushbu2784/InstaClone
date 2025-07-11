import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation", // 🆕 Add this to relate messages to conversation
    required: true,
  },
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🆕 Tracks users who have read the message
    },
  ],
}, { timestamps: true })

export const Message = mongoose.model('Message', messageSchema);