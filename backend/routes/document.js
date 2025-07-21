// 📄 routes/document.js
const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

// ✅ Get all documents (owned + shared)
router.get("/", async (req, res) => {
  const username = req.session?.user?.username;
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const owned = await Document.find({ owner: username }, "_id title updatedAt").sort({ updatedAt: -1 });
    const shared = await Document.find({ collaborators: username }, "_id title updatedAt").sort({ updatedAt: -1 });
    res.json({ owned, shared });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// ✅ Get a specific document
router.get("/:id", async (req, res) => {
  const username = req.session?.user?.username;
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.owner !== username && !doc.collaborators.includes(username)) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

// ✅ Create a new document
router.post("/", async (req, res) => {
  const username = req.session?.user?.username;
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const doc = await Document.create({
      title: req.body.title || "Untitled Document",
      content: { ops: [{ insert: "Welcome to Real-Time Edify!\n" }] },
      owner: username,
      collaborators: [],
      lastEditedBy: username,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to create document" });
  }
});

// ✅ Update a document title
router.put("/:id", async (req, res) => {
  const username = req.session?.user?.username;
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.owner !== username && !doc.collaborators.includes(username)) {
      return res.status(403).json({ error: "Access denied" });
    }

    doc.title = req.body.title;
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to update title" });
  }
});

// ✅ Delete a document
router.delete("/:id", async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// ✅ Add a collaborator
router.post("/:id/collaborators", async (req, res) => {
  const username = req.session?.user?.username;
  const { username: collaborator } = req.body;
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.owner !== username) {
      return res.status(403).json({ error: "Only owner can add collaborators" });
    }

    if (!doc.collaborators.includes(collaborator)) {
      doc.collaborators.push(collaborator);
      await doc.save();
    }

    res.json({ collaborators: doc.collaborators });
  } catch (err) {
    res.status(500).json({ error: "Failed to add collaborator" });
  }
});

// ✅ Update collaborators list (replace all)
router.put("/:id/collaborators", async (req, res) => {
  const username = req.session?.user?.username;
  const { collaborators } = req.body;
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.owner !== username) {
      return res.status(403).json({ error: "Only owner can update collaborators" });
    }

    doc.collaborators = collaborators;
    await doc.save();
    res.json({ collaborators: doc.collaborators });
  } catch (err) {
    res.status(500).json({ error: "Failed to update collaborators" });
  }
});

// ✅ Remove a collaborator
router.delete("/:id/collaborators", async (req, res) => {
  const username = req.session?.user?.username;
  const { username: collaborator } = req.body;
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.owner !== username) {
      return res.status(403).json({ error: "Only owner can remove collaborators" });
    }

    doc.collaborators = doc.collaborators.filter((c) => c !== collaborator);
    await doc.save();
    res.json({ collaborators: doc.collaborators });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove collaborator" });
  }
});

module.exports = router;
