import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

import { createDbPool } from "./db.js";
import authMiddleware, { getJwtSecret } from "./auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const KEYVAULT_URI = process.env.KEYVAULT_URI;

let cachedOpenAiApiKey = null;
let openaiClient = null;

async function getSecret(secretName) {
  if (!KEYVAULT_URI) {
    throw new Error(`KEYVAULT_URI is not set. Cannot fetch secret "${secretName}"`);
  }

  const credential = new DefaultAzureCredential();
  const client = new SecretClient(KEYVAULT_URI, credential);
  const secret = await client.getSecret(secretName);

  if (!secret.value) {
    throw new Error(`Secret "${secretName}" is empty or missing`);
  }

  return secret.value;
}

async function getOpenAiApiKey() {
  if (cachedOpenAiApiKey) {
    return cachedOpenAiApiKey;
  }

  if (process.env.OPENAI_API_KEY) {
    cachedOpenAiApiKey = process.env.OPENAI_API_KEY;
    return cachedOpenAiApiKey;
  }

  cachedOpenAiApiKey = await getSecret("openai-api-key");
  return cachedOpenAiApiKey;
}

async function getOpenAiClient() {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = await getOpenAiApiKey();

  openaiClient = new OpenAI({
    apiKey,
  });

  return openaiClient;
}

const pool = await createDbPool();

// Basic route for testing DB
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0].now });
  } catch (err) {
    console.error("DB query failed:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Mood Muncher API is running!");
});

// Combined route: snack suggestion + image
app.post("/predict-snack-and-image", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "mood is required" });
  }

  try {
    const openai = await getOpenAiClient();

    const snackPrompt = `You are a silly AI. Suggest a snack for someone based on this sentence: "${mood}". Make it absurd and funny, and relate the snack to the sentence in a humorous way.`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: snackPrompt }],
    });

    const snackSuggestion = chatResponse.choices[0].message.content;

    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Cartoonish, absurd, living snack: ${snackSuggestion}, colorful, whimsical, funny`,
      n: 1,
      size: "1024x1024",
    });

    const base64Image = imageResponse.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    await pool.query(
      "INSERT INTO mood_snacks (user_id, mood, snack, image_url) VALUES ($1, $2, $3, $4)",
      [userId, mood, snackSuggestion, imageUrl]
    );

    res.json({
      mood,
      snackSuggestion,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});

app.get("/history", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM mood_snacks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, name, hashed]
    );

    const user = result.rows[0];
    const jwtSecret = await getJwtSecret();

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const jwtSecret = await getJwtSecret();
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});