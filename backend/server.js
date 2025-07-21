const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const Document = require("./models/Document");
const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/document"); // ✅ Modularized

const app = express();
const server = http.createServer(app);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error", err));

// ✅ Enable CORS with credentials BEFORE session
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Session middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  },
});

app.use(sessionMiddleware);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes); // ✅ Modular document routes

app.get("/api/auth/me", (req, res) => {
  if (req.session?.user) {
    return res.json({ username: req.session.user.username });
  }
  return res.status(401).json({ error: "Not logged in" });
});

// ✅ Serve static files from React build
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:4000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

const sharedSession = require("express-socket.io-session");
io.use(sharedSession(sessionMiddleware, { autoSave: true }));
io.engine.use((req, res, next) => {
  sessionMiddleware(req, {}, next);
});

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);
  console.log("📦 Session from socket:", socket.request.session?.user);

  socket.onAny((event, ...args) => {
    console.log("📥 Received event:", event, args);
  });

  socket.on("get-document", async (documentId) => {
    const username = socket.request.session?.user?.username;
    if (!username) {
      console.log("❌ Unauthorized socket access");
      socket.emit("error-message", "Unauthorized user");
      socket.disconnect(true);
      return;
    }

    socket.username = username;
    socket.documentId = documentId;

    let document = await Document.findById(documentId);
    if (!document) {
      document = await Document.create({
        _id: documentId,
        title: "Untitled Document",
        content: { ops: [{ insert: "Welcome to Real-Time Edify!\n" }] },
        owner: username,
        lastEditedBy: username,
      });
    } else if (document.owner !== username && !document.collaborators.includes(username)) {
      return socket.emit("error-message", "Access denied to this document");
    }

    socket.join(documentId);
    socket.emit("load-document", {
      content: document.content,
      title: document.title,
      lastEditedBy: document.lastEditedBy || "Unknown",
    });
  });

  socket.on("send-changes", ({ delta, username }) => {
    if (!socket.documentId) return;
    socket.to(socket.documentId).emit("receive-changes", { delta, username });
  });

  socket.on("save-document", async (data) => {
    try {
      if (!socket.documentId) {
        return socket.emit("error-message", "Missing document ID.");
      }
      await Document.findByIdAndUpdate(socket.documentId, {
        content: data.content,
        title: data.title || "Untitled Document",
        lastEditedBy: data.lastEditedBy || "Unknown",
      });
      socket.to(socket.documentId).emit("last-edited-by", {
        username: data.lastEditedBy || "Unknown",
      });
    } catch (err) {
      socket.emit("error-message", "Failed to save document.");
    }
  });

  socket.on("update-title", async ({ id, title }) => {
    try {
      await Document.findByIdAndUpdate(id, { title });
    } catch (err) {
      socket.emit("error-message", "Failed to update title.");
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Disconnected:", socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
