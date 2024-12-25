require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./models/multer"); // Import multer middleware
const { authenticateToken } = require("./utilities");
const path = require("path");
const fs = require("fs");


// Connect to MongoDB
mongoose
  .connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import User and TravelStory models
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create account endpoint
app.post("/create-account", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullName, email, password: hashedPassword });
    const savedUser = await user.save();

    const accessToken = jwt.sign(
      { userId: savedUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    return res.status(201).json({
      error: false,
      user: { fullName: savedUser.fullName, email: savedUser.email },
      accessToken,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Error in /create-account:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: true, message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    return res.json({
      error: false,
      message: "Login Successful",
      user: { fullName: user.fullName, email: user.email },
      accessToken,
    });
  } catch (error) {
    console.error("Error in /login:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Get user endpoint
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.json({ error: false, user });
  } catch (error) {
    console.error("Error in /get-user:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Add travel story endpoint
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  try {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      imageUrl,
      visitedDate: new Date(visitedDate),
      userId,
    });

    const savedStory = await travelStory.save();
    return res.status(201).json({
      error: false,
      message: "Travel story added successfully",
      travelStory: savedStory,
    });
  } catch (error) {
    console.error("Error in /add-travel-story:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Get all travel stories endpoint
app.get("/get-all-stories", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const travelStories = await TravelStory.find({ userId }).sort({ isFavourite: -1 });

    if (!travelStories.length) {
      return res.status(404).json({ error: false, message: "No stories found." });
    }

    res.status(200).json({ stories: travelStories });
  } catch (error) {
    console.error("Error in /get-all-stories:", error);
    res.status(500).json({ error: true, message: error.message || "Internal Server Error" });
  }
});

// Image upload endpoint
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No image uploaded" });
    }

    const imageUrl = `http://localhost:${process.env.PORT || 3012}/uploads/${req.file.filename}`;
    res.status(201).json({ error: false, imageUrl });
  } catch (error) {
    console.error("Error in /image-upload:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Delete image endpoint
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    return res.status(400).json({ error: true, message: "imageUrl parameter is required" });
  }

  try {
    const filePath = path.join(__dirname, "uploads", path.basename(imageUrl));

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).json({ error: true, message: "File not found" });
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ error: true, message: "Failed to delete the file" });
        }
        return res.status(200).json({ error: false, message: "File deleted successfully" });
      });
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Edit travel story endpoint
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { id } = req.params;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !visitedDate) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });
    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || `http://localhost:${process.env.PORT || 3012}/assets/placeholder.png`;
    travelStory.visitedDate = new Date(visitedDate);

    await travelStory.save();

    return res.status(200).json({ error: false, message: "Travel story updated successfully", travelStory });
  } catch (error) {
    console.error("Error updating travel story:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Delete travel story endpoint
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });
    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    await TravelStory.deleteOne({ _id: id, userId });

    const imageUrl = travelStory.imageUrl;
    const filePath = path.join(__dirname, "uploads", path.basename(imageUrl));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    console.error("Error in /delete-story:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Update isFavourite field endpoint
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId:userId });
    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    travelStory.isFavourite = isFavourite;
    await travelStory.save();

    res.status(200).json({ story: travelStory, message: "Update Successful" });
  } catch (error) {
    console.error("Error in /update-is-favourite:", error);
    res.status(500).json({ error: true, message: error.message });
  }
});

app.get("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
      return res.status(404).json({ error: true, message: "query is required" });
  }

  try {
      const searchResults = await TravelStory.find({
          userId: userId,
          $or: [
              { story: { $regex: query, $options: "i" } },
              { title: { $regex: query, $options: "i" } },
              { visitedLocation: { $regex: query, $options: "i" } },
          ],
      }).sort({isFavourite:-1});

      return res.status(200).json({ stories:searchResults });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.messaage });
  }
});


app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
      // Convert startDate and endDate from milliseconds to Date objects
      const start = new Date(parseInt(startDate));
      const end = new Date(parseInt(endDate));

      // Find travel stories that belong to the authenticated user and fall within the date range
      const filteredStories = await TravelStory.find({
          userId: userId,
          visitedDate: { $gte: start, $lte: end },
      }).sort({ isFavourite: -1 });

      // Send the filtered stories as the response
      res.status(200).json({ stories: filteredStories });
  } catch (error) {
      // Handle any errors
      res.status(500).json({ error: true, message: error.message });
  }
});
// Start the server
const PORT = process.env.PORT || 3012;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
