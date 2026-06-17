const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const TOTPEntry = require("../models/TOTPEntry");

const router = express.Router();
router.use(auth);

// GET /api/totp
router.get("/", async (req, res) => {
  try {
    const entries = await TOTPEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ entries });
  } catch {
    res.status(500).json({ error: "Failed to fetch 2FA entries" });
  }
});

// POST /api/totp
router.post("/",
  [
    body("name").trim().notEmpty().isLength({ max: 200 }),
    body("encryptedSecret").notEmpty(),
    body("secretIv").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, encryptedSecret, secretIv } = req.body;
      const entry = new TOTPEntry({ userId: req.userId, name, encryptedSecret, secretIv });
      await entry.save();
      res.status(201).json({ entry });
    } catch {
      res.status(500).json({ error: "Failed to save 2FA entry" });
    }
  }
);

// DELETE /api/totp/:id
router.delete("/:id", async (req, res) => {
  try {
    const entry = await TOTPEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!entry) return res.status(404).json({ error: "2FA entry not found" });
    res.json({ message: "2FA entry removed" });
  } catch {
    res.status(500).json({ error: "Failed to delete 2FA entry" });
  }
});

module.exports = router;
