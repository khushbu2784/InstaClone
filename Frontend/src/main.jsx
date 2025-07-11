import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ThemeProvider } from "./ThemeContext"; // ✅ correct
import FullScreenLoader from "./components/FullScreenLoader";
import axios from "axios";


axios.defaults.baseURL = import.meta.env.VITE_API_URL; // ✅ set backend API base
axios.defaults.withCredentials = true; // ✅ send cookies (required for login/session)

let persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<FullScreenLoader />} persistor={persistor}>
        <ThemeProvider>
          <App />
          <Toaster className="text-white bg-slate-600" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
