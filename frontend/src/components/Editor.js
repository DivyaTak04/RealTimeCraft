// ✅ FULL FIXED Editor.js (client-side)

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link", "image"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"],
];

export default function Editor({ documentId, title, setLastEditedBy }) {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [isDirty, setIsDirty] = useState(false);
  const [lastEditor, setLastEditor] = useState("");
  const [showEditorInfo, setShowEditorInfo] = useState(false);
  const wrapperRef = useRef();

  // 1. Initialize socket AFTER verifying auth
  useEffect(() => {
  let s;

  const init = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      console.log("✅ /me response:", data);

      const username = data?.username || data?.user?.username;
      if (!username) throw new Error("No session user");

      sessionStorage.setItem("username", username);

      s = io("http://localhost:4000", {
        withCredentials: true,
        transports: ["websocket"],
      });

      s.on("connect", () => {
        console.log("✅ Socket connected:", s.id);
        setSocket(s);
      });
    } catch (err) {
      console.error("❌ Auth or Socket Init Error:", err);
    }
  };

  init();

  return () => s && s.disconnect();
}, []);


  // 2. Init Quill
  useEffect(() => {
    const container = document.createElement("div");
    wrapperRef.current.innerHTML = "";
    wrapperRef.current.append(container);

    const q = new Quill(container, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    // Apply sticky toolbar styles
const toolbar = container.querySelector(".ql-toolbar");
if (toolbar) {
  toolbar.classList.add(
  "sticky", "top-0", "z-20", "bg-white/70", "dark:bg-[#1e293b]/70",
  "backdrop-blur", "border-b", "border-light-accent/20", "dark:border-dark-accent/30",
  "rounded-t-xl", "shadow-md"
);

}

    q.disable();
    q.setText("Loading...");
    setQuill(q);
    console.log("✅ Quill initialized");
  }, []);

  // 3. Load document
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (doc) => {
      console.log("📩 Document loaded:", doc);
      quill.setContents(doc.content);
      quill.enable();
    });

    console.log("📨 Emitting get-document", documentId); // Add this
  socket.emit("get-document", documentId); // Does this ever hit server?
  }, [socket, quill, documentId]);

  // 4. Text change → send changes
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;

      socket.emit("send-changes", {
        delta,
        username: sessionStorage.getItem("username") || "Unknown",
      });
      setIsDirty(true);
    };

    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  // 5. Incoming changes
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = ({ delta, username }) => {
      quill.updateContents(delta);

      if (username !== sessionStorage.getItem("username")) {
        setLastEditor(username);
        setShowEditorInfo(true);
        setTimeout(() => setShowEditorInfo(false), 3000);
      }
    };

    socket.on("receive-changes", handler);
    return () => socket.off("receive-changes", handler);
  }, [socket, quill]);

  // 6. Auto-save if dirty
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      if (!isDirty) return;

      const username = sessionStorage.getItem("username") || "Unknown";

      setSaveStatus("saving");
      socket.emit("save-document", {
        content: quill.getContents(),
        title,
        lastEditedBy: username,
      });

      setTimeout(() => {
        setSaveStatus("saved");
        setIsDirty(false);
      }, 800);
    }, 2000);

    return () => clearInterval(interval);
  }, [socket, quill, isDirty, title]);

  // 7. Last edited by
  useEffect(() => {
    if (!socket) return;

    const handle = ({ username }) => {
      if (username && typeof setLastEditedBy === "function") {
        setLastEditedBy(username);
      }
    };

    socket.on("last-edited-by", handle);
    return () => socket.off("last-edited-by", handle);
  }, [socket, setLastEditedBy]);

  // 8. Error messages
  useEffect(() => {
    if (!socket) return;

    const handle = (msg) => {
      console.error("⚠️ Socket error:", msg);
      setSaveStatus("error");

      if (msg === "Access denied to this document") {
        alert("Access denied.");
        window.location.href = "/dashboard";
      }
    };

    socket.on("error-message", handle);
    return () => socket.off("error-message", handle);
  }, [socket]);

  return (
    <div className="rounded-2xl backdrop-blur-xl p-6 
                bg-white/60 dark:bg-[#1e293b]/60 
                border border-[#c084fc] dark:border-[#22d3ee] 
                shadow-xl hover:shadow-2xl transition-all duration-300">

      {/* Save Status */}
      {isDirty && (
        <div className="text-sm text-right italic text-light-text dark:text-dark-text mb-2 transition-all duration-300">
          {saveStatus === "saving" && "💾 Saving..."}
          {saveStatus === "saved" && "✅ All changes saved"}
          {saveStatus === "error" && "⚠️ Error saving"}
        </div>
      )}

      {/* Who is editing */}
      {showEditorInfo && lastEditor && (
        <div  className="text-sm text-right text-blue-600 dark:text-cyan-400 mb-4 transition-opacity duration-300 animate-fade-in">
          ✍️ {lastEditor} is editing...
        </div>
      )}

      <div
  ref={wrapperRef}
  className="min-h-[400px] rounded-xl overflow-hidden 
             bg-white/80 dark:bg-[#1e293b]/80 
             border border-[#c084fc] dark:border-[#22d3ee] 
             backdrop-blur-md p-4 shadow-md 
             transition-all duration-300"
></div>

    </div>
  );
}
