// // store.js (very top - before any import)
// if (import.meta.env.MODE === "development") {
//   const originalConsole = { warn: console.warn, error: console.error };

//   console.warn = (...args) => {
//     if (
//       args[0]?.includes?.("A non-serializable value") ||
//       args[0]?.includes?.("redux-persist/createPersistoid")
//     ) return;
//     originalConsole.warn(...args);
//   };

//   console.error = (...args) => {
//     if (
//       args[0]?.includes?.("A non-serializable value") ||
//       args[0]?.includes?.("redux-persist/createPersistoid")
//     ) return;
//     originalConsole.error(...args);
//   };
// }

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import postSlice from "./postSlice.js"
import socketSlice from "./socketSlice.js"
import chatSlice from "./chatSlice.js"
import rtnSlice from "./rtnSlice.js";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['socketio'],
}
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNotifications: rtnSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['socketio.socket'],
      },
    }),
})

export default store;