import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import MainLayout from "./components/MainLayout";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import ChatPage from "./Pages/ChatPage";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SuggestedUsers from "./components/SuggestedUsers";
import BlockedUsers from "./components/BlockedUsers";
import Setting from "./Pages/Setting";
import { addNotification } from "./redux/rtnSlice";
import { incrementUnread } from "./redux/chatSlice";
import ForgotPassword from "./Pages/ForgotPassword";
import Explore from "./Pages/Explore";
import ResetPassword from "./Pages/ResetPassword";
import VerifyEmail from "./Pages/VerifyEmail";
import store from "./redux/store";
import axios from "axios";
import { setPosts } from "./redux/postSlice";
import NotFound from "./Pages/NotFound";
import ChangePassword from "./components/ChangePassword";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ), // ✅ protected wrapper here
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/account/edit", element: <EditProfile /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/setting", element: <Setting /> },
      { path: "/suggestedUser", element: <SuggestedUsers /> },
      { path: "/setting/blocked", element: <BlockedUsers /> },
      { path: "/explore", element: <Explore /> },
      {path:"/changePassword", element: <ChangePassword />},
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verifyEmail", element: <VerifyEmail /> },
  { path: "/forgotPassword", element: <ForgotPassword /> },
  { path: "/resetPassword/:token", element: <ResetPassword /> },

  { path: "*", element: <NotFound /> },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth); // ✅ fix
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   axios.get("/posts").then((res) => {
  //     setPosts(res.data);
  //     setLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/posts");
        dispatch(setPosts(res.data));
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };
    fetchPosts();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      // Disconnect previous socket if exists
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socketio = io(`${import.meta.env.VITE_SOCKET_URL}`, {
        withCredentials: true,
        query: { userId: user._id },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });
      console.log("📦 SOCKET ENV:", import.meta.env.VITE_SOCKET_URL);

      socketRef.current = socketio;
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("newMessage", (msg) => {
        if (!msg || !msg.senderId) return;

        console.log("📨 New message from:", msg.senderId);
        console.log("📨 selectedUser:", selectedUser?._id);

        // ✅ FIX HERE
        const currentSelectedUser = store.getState().auth.selectedUser;
        if (msg.senderId !== currentSelectedUser?._id) {
          dispatch(incrementUnread(msg.senderId));
        }
      });

      socketio.on("notification", (notification) => {
        if (notification.type === "like" || notification.type === "follow") {
          dispatch(
            addNotification({
              ...notification,
              timestamp: new Date().toISOString(),
            })
          );
        }
      });

      return () => {
        socketio.disconnect();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.disconnect();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  // if (loading) return <FullScreenLoader />;

  return <RouterProvider router={browserRouter} />;
}

export default App;
