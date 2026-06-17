const mongoose = require("mongoose");

const totpEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: 200,
  },
  // The TOTP secret is encrypted client-side before being stored
  encryptedSecret: {
    type: String,
    required: true,
  },
  secretIv: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TOTPEntry", totpEntrySchema);
