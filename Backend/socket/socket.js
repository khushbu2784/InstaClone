import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

//This attaches Socket.IO to your HTTP server.
//cors allows frontend (like React app) to connect via WebSocket.
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173",
    "https://insta-clone27.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true, // Allows cookies to be sent with requests
  },
});

// Map of userId -> array of socketIds
const userSocketMap = {};

//Used when you want to send a message or notification to a specific user.
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

//Sends a list of online users (by userId) to all connected clients.
const emitOnlineUsers = () => {
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.warn(`⚠️ Connection attempt without userId. SocketId = ${socket.id}`);
    socket.disconnect();
    return;
  }

  socket.userId = userId;

  if (!userSocketMap[userId]) {
    userSocketMap[userId] = [];
  }
  userSocketMap[userId].push(socket.id);

  // Broadcast the updated list of online users to all clients
  emitOnlineUsers();

  // Remove the socket ID from the map.
  // If the user has no more active sockets, remove the user entirely.
  // Then notify all users about the updated online list.
  socket.on("disconnect", () => {
    const uid = socket.userId;
    if (uid) {
      userSocketMap[uid] = userSocketMap[uid].filter((id) => id !== socket.id);
      if (userSocketMap[uid].length === 0) {
        delete userSocketMap[uid];
      }

      emitOnlineUsers();
    }
  });

  socket.on("error", (err) => {
    console.error(`❗ Socket error for userId = ${socket.userId}:`, err.message);
  });
});

export { app, server, io };
