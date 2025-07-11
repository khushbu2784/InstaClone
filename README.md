
# 📸 InstaClone

A full-stack social media application inspired by Instagram. Built with **React**, **Express.js**, **MongoDB**, and **Tailwind CSS**, it supports posts, comments, likes, chat, stories, bookmarks, follow/unfollow, blocking, and more.

---

## 🔗 Live Demo

👉 [InstaClone on Vercel](https://insta-clone27.vercel.app)

---

## ✨ Features

- 👤 User authentication (signup/login) with validations using Zod
- 📷 Create, edit, and delete posts
- ❤️ Like & comment on posts
- 💬 Real-time messaging
- 🔐 Block/unblock users
- 📚 Bookmark posts
- 🧾 Upload and view stories (like Instagram)
- 👥 Follow/Unfollow users
- 📱 Mobile-first responsive design
- 🌙 Light/Dark theme toggle
- 🔍 Search users
- ⚙️ Profile editing & settings
- 🎭 Action sheets and swipe dialogs (like Instagram)

---

## 🔧 Tech Stack

### Frontend 🖼️

- React.js
- Redux Toolkit
- React Router
- Tailwind CSS
- ShadCN UI & Lucide Icons

### Backend 🧠

- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io (for real-time chat)
- Cloudinary (image uploads)
- JWT Authentication
- Multer (file handling)

---

## 📁 Folder Structure

```bash
InstaClone/
├── Backend/           # Node.js + Express API
├── Frontend/          # React application
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── redux/
│       └── assets/
└── README.md

---

## 🛠️ Environment Variables

Create a `.env` file in both `Backend/` and `Frontend/` folders.

### Backend `.env`

PORT=8000
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

### Frontend `.env`

VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
```

---

## 🚀 Getting Started

### Clone the repo

```bash
git clone https://github.com/khushbu2784/InstaClone.git
cd InstaClone
```

### Setup Backend

```bash
cd Backend
npm install
npm start
```

### Setup Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

### 📌 Author

**Khushbu Parmar**  
📍 Ahmedabad, Gujarat  
🎓 MSc(IT) @ K.S. School of Business Management and IT  
🌐 [LinkedIn](https://www.linkedin.com/in/khushbu-parmar-a98606315/)  
💻 [GitHub](https://github.com/khushbu2784)  
📧 [khushbuparmar27804@gmail.com](mailto:khushbuparmar27804@gmail.com)

---

## 🌟 Star this repo if you like the project!

