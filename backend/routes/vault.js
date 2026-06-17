const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const VaultEntry = require("../models/VaultEntry");

const router = express.Router();
router.use(auth);

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const entryValidators = [
  body("site").trim().notEmpty().withMessage("Site is required").isLength({ max: 500 }),
  body("username").optional().trim().isLength({ max: 500 }),
  body("ciphertext").notEmpty().withMessage("Encrypted password is required").isLength({ max: 10000 }),
  body("iv").notEmpty().withMessage("IV is required").isLength({ max: 500 }),
  body("category").optional().isIn(["Social", "Work", "Finance", "Other"]),
];

// GET /api/vault — fetch all entries for this user
router.get("/", async (req, res) => {
  try {
    const entries = await VaultEntry.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ entries });
  } catch (err) {
    console.error("Vault GET error:", err.message);
    res.status(500).json({ error: "Failed to fetch vault" });
  }
});

// POST /api/vault — create entry
router.post("/", entryValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { site, username, ciphertext, iv, category } = req.body;
    const entry = new VaultEntry({ userId: req.userId, site, username, ciphertext, iv, category });
    await entry.save();
    res.status(201).json({ entry });
  } catch (err) {
    console.error("Vault POST error:", err.message);
    res.status(500).json({ error: "Failed to create entry" });
  }
});

// PUT /api/vault/:id — update entry
router.put("/:id", entryValidators, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid entry ID" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const entry = await VaultEntry.findOne({ _id: req.params.id, userId: req.userId });
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    const { site, username, ciphertext, iv, category } = req.body;
    Object.assign(entry, { site, username, ciphertext, iv, category });
    await entry.save();
    res.json({ entry });
  } catch (err) {
    console.error("Vault PUT error:", err.message);
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// DELETE /api/vault/:id — delete entry
router.delete("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid entry ID" });
  }

  try {
    const entry = await VaultEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    res.json({ message: "Entry removed from cave" });
  } catch (err) {
    console.error("Vault DELETE error:", err.message);
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

module.exports = router;