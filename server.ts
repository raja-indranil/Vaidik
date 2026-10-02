import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// API endpoint to generate or customize scripts for the 12 Houses
app.post('/api/generate-script', async (req: Request, res: Response) => {
  try {
    const { style, targetAudience, language, focusHouse } = req.body;

    const prompt = `You are an expert Vedic Astrologer and master video scriptwriter.
The user wants a compelling video narration script for the 12 Houses of Vedic Astrology (12 Ghar / Janam Kundli).
Reference script source:
1 — Aap khud, sehat, swabhav (House 1: Native, health, longevity, nature)
2 — Paisa, parivaar, vaani (House 2: Wealth, family, speech, food habits)
3 — Chhota bhai-behen, himmat, documents (House 3: Younger siblings, courage, communications, short travel)
4 — Maa, ghar, gaadi, property (House 4: Mother, house, vehicle, property, domestic happiness)
5 — Santaan, prem, padhai (House 5: Children, love, education, intellect, speculation)
6 — Bimari, karz, dushman, naukri (House 6: Diseases, debts, enemies, service/job, litigation)
7 — Jeevan saathi, partnership (House 7: Spouse, business partnerships, open enemies)
8 — Rukavat, aakasmik, gupt cheezein (House 8: Obstacles, sudden events, hidden secrets, occult, longevity)
9 — Pita, bhagya, guru (House 9: Father, fortune, guru, higher education, pilgrimage)
10 — Career, samman, naam (House 10: Career, status, karma, prestige, name and fame)
11 — Bada bhai-behen, laabh, ichha poori hona (House 11: Elder siblings, gains, social circle, fulfillment of hopes)
12 — Kharcha, videsh, nuksaan (House 12: Expenses, foreign lands, isolation, hospital, spiritual liberation/moksha)

Style requested: ${style || 'Engaging Hinglish Video Script'}
Language: ${language || 'Hinglish'}
Target Audience: ${targetAudience || 'YouTube / Instagram Reel Viewers'}
${focusHouse ? `Focus on House ${focusHouse} specifically.` : 'Provide all 12 houses + punchy intro and outro.'}

Format the response strictly as valid JSON matching this schema:
{
  "title": "Video title",
  "intro": "Catchy intro line (1-2 sentences)",
  "houses": [
    {
      "houseNumber": 1,
      "sanskritName": "Tanu Bhava",
      "oneLiner": "Aap khud, sehat, swabhav",
      "narration": "Narration text for this house (approx 20-35 words, energetic and clear)",
      "visualCue": "Description of visual animation effect or focus",
      "keywords": ["Self", "Health", "Swabhav", "Aayu"]
    }
  ],
  "outro": "Catchy outro line with call to action"
}
Output ONLY the JSON object, no markdown ticks, no extra text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Clean possible formatting
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(cleaned);
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error generating script:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate script'
    });
  }
});

// API endpoint to expand details for a specific house
app.post('/api/deep-dive-house', async (req: Request, res: Response) => {
  try {
    const { houseNumber, houseName, significations } = req.body;

    const prompt = `You are a Vedic Astrology scholar. Provide a 45-second high-impact masterclass script for House ${houseNumber} (${houseName || ''}).
Key significations: ${significations || ''}.
Include:
1. Exact Hindi/Hinglish spoken script (concise, poetic, insightful).
2. English translation and essence.
3. Astrological Karaka planets (e.g. Sun, Jupiter, Mars).
4. Practical tip or remedy for this house.

Respond strictly in JSON:
{
  "houseNumber": ${houseNumber},
  "hindiScript": "string",
  "englishScript": "string",
  "karakaPlanets": ["string"],
  "astrologicalSecret": "string",
  "practicalTip": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error deep diving house:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
