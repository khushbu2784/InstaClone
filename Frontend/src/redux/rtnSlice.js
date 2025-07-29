import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotifications",
  initialState: {
    allNotifications: [],     // For NotificationPanel
    unreadCount: 0,           // For badge
    badgeCleared: false,      // Whether badge is cleared
    lastClearedAt: null,      // Timestamp of last clear
    recentTypes: [],          // For displaying icons in badge
  },
  reducers: {
    addNotification: (state, action) => {
      const { userId, postId, type } = action.payload;
      const now = Date.now(); // Always fresh timestamp

      //Remove previous notification of the same type, user, and post
      state.allNotifications = state.allNotifications.filter(
        (n) => !(n.userId === userId && n.postId === postId && n.type === type)
      );

      //Add latest notification to the top
      state.allNotifications.unshift({ ...action.payload, timestamp: now });

      //Count as unread only if after lastClearedAt
      if (!state.lastClearedAt || now > state.lastClearedAt) {
        state.unreadCount += 1;
        state.badgeCleared = false;
      }

      //Show only types from unread notifications
      const recent = state.allNotifications.filter(
        (n) => !state.lastClearedAt || n.timestamp > state.lastClearedAt
      );
      const recentTypesSet = new Set(recent.map((n) => n.type));
      state.recentTypes = [...recentTypesSet];
    },

    clearNotificationBadge: (state) => {
      state.unreadCount = 0;
      state.badgeCleared = true;
      state.lastClearedAt = Date.now();   //Track when cleared
      state.recentTypes = [];
    },

    resetNotifications: (state) => {
      state.allNotifications = [];
      state.unreadCount = 0;
      state.badgeCleared = true;
      state.lastClearedAt = null;
      state.recentTypes = [];
    },
  },
});

export const {
  addNotification,
  clearNotificationBadge,
  resetNotifications,
} = rtnSlice.actions;

export default rtnSlice.reducer;
