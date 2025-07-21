# 📝 RealTimeCraft - Real-Time Collaborative Document Editor
"COMPANY": CODTECH IT SOLUTIONS

"NAME": DIVYA TAK

"INTERN ID": CT08DN804

"DOMAIN": FULL STACK DEVELOPMENT

"DURATION": 8 WEEK

"MENTOR": NEELA SANTOSH

# 📝 RealTimeCraft

RealTimeCraft is a real-time collaborative document editor built with React, Node.js, Socket.IO, and MongoDB. It allows multiple users to edit the same document simultaneously with live synchronization, authentication, and a beautiful animated UI supporting dark and light themes.

## 🚀 Features

- 🔐 **User Authentication** (Register/Login)
- 📄 **Create, Edit, Delete, and Search Documents**
- ✍️ **Real-Time Collaborative Editing**
- 📡 **WebSocket-Based Sync with Socket.IO**
- 💾 **Auto-Save with Status Indicator**
- 👥 **Add Collaborators to Documents**
- 🌙 **Dark/Light Theme Toggle**
- 🧠 **Modern UI with Tailwind CSS + Framer Motion**
- 🎨 **Animated Background Blobs**

## 🧰 Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- React Router
- Quill.js (for rich text editing)
- Framer Motion (animations)

**Backend:**
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)

## 🖼️ Screenshots
<img width="1906" height="922" alt="image" src="https://github.com/user-attachments/assets/94e256ac-da80-4b9f-9122-0826f35dda21" />

<img width="1908" height="921" alt="image" src="https://github.com/user-attachments/assets/960c1168-24d7-461d-a068-f202727c5a81" />

<img width="1912" height="926" alt="image" src="https://github.com/user-attachments/assets/9a3ef7af-3e58-442c-90de-f89df5beaae9" />

<img width="1905" height="919" alt="image" src="https://github.com/user-attachments/assets/fc51fd12-e016-4420-95a5-3698dad5ec75" />

<img width="1908" height="915" alt="image" src="https://github.com/user-attachments/assets/50d53ff8-795b-4a69-87af-d77ec9531708" />

<img width="1901" height="904" alt="image" src="https://github.com/user-attachments/assets/3e70cd0f-3303-446a-8e72-9974dc4b00b1" />


## ⚙️ Installation & Running Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/DivyaTak/RealTimeCraft.git
   cd realtimecraft

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install

4. **Configure environment variables**

   Create a .env file in the backend folder:
   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000

5. **Build frontend and start backend**
   ```bash
   cd frontend
   npm run build

   cd ../backend
   node server.js

The frontend will be served from the backend server at http://localhost:4000

Built with ❤️ by Divya Tak
