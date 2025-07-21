const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Document",
    },
    content: Object,
    lastEditedBy: {
      type: String,
      default: "Unknown",
    },

    // ✅ NEW: Owner of the document (username from session)
    owner: {
      type: String,
      required: true,
    },

    // ✅ PREP: We'll use this soon for sharing documents
    collaborators: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("Document", DocumentSchema);
