import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your real API key
const genAI = new GoogleGenerativeAI("AIzaSyARIHmFiqBpN6zr6mQDFJ4V5L3nL-W3cuo");

export const getTravelData = async (req, res) => {
  const { from, to, date } = req.body;

  const prompt = `
You're a smart travel assistant AI.

Generate a **detailed travel plan** for a trip from **"${from}" to "${to}"** on **"${date}"**.

### 🧭 Your response should return the following JSON structure (do not return markdown or code block):

{
  "flights": [
    {
      "airline": "",
      "priceRange": "",
      "duration": "",
      "bookingLink": "",
      "budgetCategory": "Low | Medium | High"
    },
    ...
  ],
  "trains": [
    {
      "trainName": "",
      "trainNumber": "",
      "classesAndPrices": "",
      "duration": "",
      "bookingLink": "",
      "budgetCategory": "Low | Medium | High"
    },
    ...
  ],
  "buses": [
    {
      "type": "Direct | Connecting",
      "priceRange": "",
      "duration": "",
      "bookingLink": "",
      "budgetCategory": "Low | Medium | High"
    },
    ...
  ],
  "summaryComparison": {
    "flight": { "low": "", "medium": "", "high": "" },
    "train": { "low": "", "medium": "", "high": "" },
    "bus": { "low": "", "medium": "", "high": "" }
  },
  "aiAdvice": "A short suggestion on best mode based on time and price.",
  "checklist": [
    "Documents to carry like ID, tickets",
    "Weather-specific items",
    "Personal essentials"
  ],
  "weatherInfo": {
    "forecast": "",
    "temperature": "",
    "tips": ""
  }
}

📌 Notes:
- Use real booking platforms (like Skyscanner, IRCTC, RedBus, etc.) for links.
- If no direct flight/train exists, mention "Not available".
- For checklist, include helpful items based on common travel needs and destination weather.
- Use proper JSON formatting only, no markdown, no explanation.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to safely parse the AI response
    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch (parseError) {
      console.warn("Parsing failed, sending raw text.");
      res.json({ rawText: text });
    }
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Gemini API failed" });
  }
};
