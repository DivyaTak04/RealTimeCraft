import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";



export default function Dashboard() {
  const [ownedDocs, setOwnedDocs] = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDocId, setEditingDocId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/documents", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return { owned: [], shared: [] };
        }
        return res.json();
      })
      .then((data) => {
        if (data?.owned && data?.shared) {
          setOwnedDocs(data.owned);
          setSharedDocs(data.shared);
        } else {
          console.error("Expected { owned, shared }, got:", data);
          setOwnedDocs([]);
          setSharedDocs([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching documents", err);
        setOwnedDocs([]);
        setSharedDocs([]);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await fetch(`http://localhost:4000/api/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setOwnedDocs((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Something went wrong while deleting the document.");
    }
  };

  const startEditing = (id, currentTitle) => {
    setEditingDocId(id);
    setEditedTitle(currentTitle);
  };

  const handleTitleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/documents/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedTitle }),
      });

      if (!res.ok) throw new Error("Update failed");

      setOwnedDocs((prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, title: editedTitle } : doc
        )
      );
      setEditingDocId(null);
      setEditedTitle("");
    } catch (err) {
      alert("Failed to update title.");
      console.error(err);
    }
  };

  const handleCreateNew = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/documents", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Document" }),
      });
      const data = await res.json();
      if (res.ok) navigate(`/doc/${data._id}`);
      else alert(data.error || "Failed to create document");
    } catch (err) {
      alert("Failed to create document");
    }
  };

  const sortDocs = (docs) =>
    docs
      .filter((doc) =>
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.updatedAt) - new Date(a.updatedAt)
          : new Date(a.updatedAt) - new Date(b.updatedAt)
      );

  const DocumentCard = ({ doc, editable }) => (
  <motion.div
    key={doc._id}
    whileHover={{
      scale: 1.03,
      boxShadow: "0 0 25px rgba(99, 102, 241, 0.3)", // soft glow
    }}
    transition={{ duration: 0.3 }}
    className="relative bg-white/90 dark:bg-[#1e293b]/90 
               border border-light-accent/30 dark:border-cyan-400/40 
               rounded-xl shadow-lg backdrop-blur-lg p-5 transition-all group"
  >
    {/* Title Edit Mode */}
    {editable && editingDocId === doc._id ? (
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        onBlur={() => handleTitleSave(doc._id)}
        onKeyDown={(e) => e.key === "Enter" && handleTitleSave(doc._id)}
        autoFocus
        className="w-full text-lg font-semibold bg-white/95 dark:bg-[#1e293b]/95 
                   border border-light-accent/40 dark:border-cyan-400/50 rounded 
                   px-3 py-2 focus:outline-none focus:ring-2 focus:ring-light-accent 
                   dark:focus:ring-dark-accent focus:scale-[1.02] transition-all"
      />
    ) : (
      <div className="flex justify-between items-start mb-3">
        <Link
          to={`/doc/${doc._id}`}
          className="flex-1 text-xl font-bold truncate text-light-text dark:text-dark-text group-hover:underline"
        >
          📄 {doc.title || "Untitled Document"}
        </Link>
        {editable && (
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => startEditing(doc._id, doc.title)}
              className="text-sm text-blue-500 hover:text-blue-700"
              title="Edit Title"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDelete(doc._id)}
              className="text-sm text-red-500 hover:text-red-700"
              title="Delete Document"
            >
              ❌
            </button>
          </div>
        )}
      </div>
    )}

    {/* Timestamp */}
    <Link to={`/doc/${doc._id}`}>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        🕒 Last Updated: {new Date(doc.updatedAt).toLocaleString()}
      </p>
    </Link>
  </motion.div>
);



  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
  
      <h1 className="text-4xl font-extrabold text-center mb-8 text-black dark:text-white">
        📁 Your Workspace
      </h1>

      {/* 🔍 Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg border shadow-inner backdrop-blur
  bg-light-card/70 dark:bg-dark-card/70 
  border-light-accent/30 dark:border-dark-accent/30 
  text-light-text dark:text-dark-text
  focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"

        />
      </div>

      {/* ➕ Create New */}
      <div className="flex justify-center mb-10">
        <button
  onClick={handleCreateNew}
  className="px-6 py-3 rounded-xl text-white font-semibold transition-transform duration-300
             shadow-lg hover:shadow-2xl hover:scale-105
             bg-gradient-to-r from-light-accent to-light-highlight 
             dark:from-dark-accent dark:to-dark-highlight"
>
  ➕ Create New Document
</button>



      </div>

      {/* 📅 Sort Toggle */}
      <div className="flex justify-end mb-4">
       <button
  onClick={() =>
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
  }
  className="text-sm px-4 py-2 rounded-lg bg-light-accent dark:bg-dark-accent 
             text-white shadow hover:brightness-110 hover:shadow-xl 
             transition-all duration-300"
>
  Sort: {sortOrder === "desc" ? "📅 Newest First" : "📅 Oldest First"}
</button>

      </div>

      {/* 👑 Owned Documents */}
{sortDocs(ownedDocs).length > 0 && (
  <div className="mb-10 p-6 rounded-2xl 
  bg-white/40 dark:bg-[#1e293b]/40 
  backdrop-blur-md shadow-lg 
  border border-[#c084fc] dark:border-[#22d3ee] 
  hover:shadow-[0_0_20px_#c084fc] dark:hover:shadow-[0_0_20px_#22d3ee] 
  transition-all duration-300">
  <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">
    👑 Owned Documents
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {sortDocs(ownedDocs).map((doc) => (
      <DocumentCard key={doc._id} doc={doc} editable={true} />
    ))}
  </div>
</div>

)}



      {/* 🧑‍🤝‍🧑 Shared With You */}
      {sortDocs(sharedDocs).length > 0 && (
  <div className="mb-10 p-6 rounded-2xl 
  bg-white/40 dark:bg-[#1e293b]/40 
  backdrop-blur-md shadow-lg 
  border border-[#c084fc] dark:border-[#22d3ee] 
  hover:shadow-[0_0_20px_#c084fc] dark:hover:shadow-[0_0_20px_#22d3ee] 
  transition-all duration-300">
  <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">
    🧑‍🤝‍🧑 Shared With You
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {sortDocs(sharedDocs).map((doc) => (
      <DocumentCard key={doc._id} doc={doc} editable={false} />
    ))}
  </div>
</div>

)}


      {/* 🧐 Empty Message */}
      {sortDocs(ownedDocs).length === 0 && sortDocs(sharedDocs).length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg italic">

          No matching documents found.
        </p>
      )}
    </div>
  );
}
