const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/users";

app.get("/", (req, res) => {
  res.json({ message: "Users Service is running 🚀" });
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB (Users DB)");
    app.listen(PORT, () =>
      console.log(`🚀 Users Service running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
