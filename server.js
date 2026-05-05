import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

// API key diambil dari environment variable (nanti diset di Railway)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Gagal dapat response dari Gemini' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));