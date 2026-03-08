import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import cors from "cors";
import pool from "./db.js";
import authMiddleware from "./auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Mood Muncher API is running!");
});

// Combined route: snack suggestion + image
app.post("/predict-snack-and-image", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { mood } = req.body;

  if (!mood) return res.status(400).json({ error: "mood is required" });

  try {
    // 1️⃣ Generate snack suggestion
    const snackPrompt = `You are a silly AI. Suggest a snack for someone based on this sentence: "${mood}". Make it absurd and funny, and relate the snack to the sentence in a humorous way.`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: snackPrompt }],
    });

    const snackSuggestion = chatResponse.choices[0].message.content;

    // 2️⃣ Generate image
    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Cartoonish, absurd, living snack: ${snackSuggestion}, colorful, whimsical, funny`,
      n: 1,
      size: "1024x1024",
    });

    // Convert base64 to a data URL
    const base64Image = imageResponse.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({
      mood,
      snackSuggestion,
      imageUrl
    });

    await pool.query(
      'INSERT INTO mood_snacks (user_id, mood, snack, image_url) VALUES ($1, $2, $3, $4)',
      [userId, mood, snackSuggestion, imageUrl]
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});

app.get('/history', authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      'SELECT * FROM mood_snacks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [userId]  // filter by current user
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
    [email, name, hashed]
  );
  const user = result.rows[0];
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});