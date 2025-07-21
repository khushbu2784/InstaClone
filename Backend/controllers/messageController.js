import { Conversation } from "../models/conversationModel.js"
import { getReceiverSocketId } from "../socket/socket.js";
import { Message } from "../models/messageModel.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id,     
      readBy: [senderId],                   
    });

    conversation.message.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Message send failed" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const currentUserId = req.id;
    const receiverId = req.params.id;
    
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, receiverId] },
    }).populate({
      path: "message",
      options: { sort: { createdAt: 1 } },
    });

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    //Mark all messages as read by current user
    await Message.updateMany(
      {
        _id: { $in: conversation.message },
        readBy: { $ne: currentUserId },
      },
      {
        $addToSet: { readBy: currentUserId },
      }
    );

    // Re-fetch after marking as read
    const updatedConversation = await Conversation.findById(conversation._id).populate({
      path: "message",
      options: { sort: { createdAt: 1 } },
    });

    return res.status(200).json({
      success: true,
      messages: updatedConversation.message,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};
