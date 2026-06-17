const mongoose = require("mongoose");

const vaultEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  site: {
    type: String,
    required: [true, "Site is required"],
    trim: true,
    maxlength: 500,
  },
  username: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  // AES-256-GCM encrypted password (encrypted client-side)
  ciphertext: {
    type: String,
    required: [true, "Encrypted password is required"],
  },
  iv: {
    type: String,
    required: [true, "IV is required"],
  },
  category: {
    type: String,
    enum: ["Social", "Work", "Finance", "Other"],
    default: "Other",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Touch updatedAt on every save
vaultEntrySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("VaultEntry", vaultEntrySchema);
