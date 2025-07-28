import { GoogleGenerativeAI } from "@google/generative-ai";
import AbortController from "abort-controller";

const genAI = new GoogleGenerativeAI("AIzaSyARIHmFiqBpN6zr6mQDFJ4V5L3nL-W3cuo");

export const getTravelData = async (req, res) => {
  try {
    const { from, to, date } = req.body;
    console.log("📥 Request Body:", req.body);

    if (!from || !to || !date) {
      return res.status(400).json({ error: "Missing required fields: from, to, or date" });
    }

    const prompt = `
You're a smart AI travel assistant.

Give me 3 best travel options from "${from}" to "${to}" for the date "${date}"...

(Your full prompt continues here...)
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    clearTimeout(timeoutId);

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ success: true, text });
  } catch (err) {
    console.error("❌ Gemini Error:", err.message || err);
    const msg = err.name === "AbortError"
      ? "Gemini API timed out. Try again."
      : "Gemini API failed. Try again later.";

    return res.status(500).json({ error: msg });
  }
};
