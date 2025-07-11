import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [],
    unreadMap: {}, // { userId: count }
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    incrementUnread: (state, action) => {
      const senderId = action.payload;
      if (!state.unreadMap) state.unreadMap = {}; // ✅ prevent undefined
      state.unreadMap[senderId] = (state.unreadMap[senderId] || 0) + 1;
    },
    resetUnread: (state, action) => {
      const userId = action.payload;
      if (state.unreadMap && Object.hasOwn(state.unreadMap, userId)) {
        delete state.unreadMap[userId];
      }
    }
  },
});

export const {
  setOnlineUsers,
  setMessages,
  incrementUnread,
  resetUnread,
} = chatSlice.actions;

export default chatSlice.reducer;
