import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
  try {
    const { systemPrompt, message } = req.body;

    // Gabungkan systemPrompt + message jadi satu contents
    // karena Gemini Free Tier tidak support systemInstruction di semua model
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\n${message}`
      : message;

    const response = await ai.models.generateContent({
      model: 'models/gemini-2.0-flash-lite-001',
      contents: fullPrompt,
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Gagal dapat response dari Gemini', detail: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));

app.get('/models', async (req, res) => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});