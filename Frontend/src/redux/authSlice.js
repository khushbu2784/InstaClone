import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      // state.user = JSON.parse(JSON.stringify(action.payload));
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      // state.suggestedUsers = JSON.parse(JSON.stringify(action.payload));
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      //state.userProfile = JSON.parse(JSON.stringify(action.payload));
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateSuggestedUser: (state, action) => {
      const updatedUser = action.payload;
      state.suggestedUsers = state.suggestedUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
    },
    logout: (state) => {
      state.user = null;
      state.suggestedUsers = [];
      state.userProfile = null;
      state.selectedUser = null;
    }
  }
});


export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, updateSuggestedUser, logout } = authSlice.actions;
export default authSlice.reducer;