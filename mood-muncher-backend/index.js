import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import cors from "cors";

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
app.post("/predict-snack-and-image", async (req, res) => {
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});