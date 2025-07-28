// controllers/searchController.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Secure way: Use environment variable instead of hardcoding API key
const genAI = new GoogleGenerativeAI("AIzaSyARIHmFiqBpN6zr6mQDFJ4V5L3nL-W3cuo");

export const getTravelData = async (req, res) => {
  try {
    const { from, to, date } = req.body;

    // 🔐 Input validation
    if (!from || !to || !date) {
      return res.status(400).json({ error: "Missing required fields: from, to, or date" });
    }

    // 🎯 Prompt creation
    const prompt = `
You're a smart AI travel assistant.

Give me 3 best travel options from "${from}" to "${to}" for the date "${date}".

Include:
✈️ **Flight** – airline, price range, duration, booking link (from [Skyscanner](https://www.skyscanner.co.in), [MakeMyTrip](https://www.makemytrip.com), [Goibibo](https://www.goibibo.com)), and budget category (**Low/Medium/High**)

🚆 **Train** – train name & number, classes & prices, duration, booking link (from [IRCTC](https://www.irctc.co.in) or [Trainman](https://www.trainman.in)), and budget category (**Low/Medium/High**)

🚌 **Bus** – direct or connecting, price range, duration, booking link (from [RedBus](https://www.redbus.in), [AbhiBus](https://www.abhibus.com)), and budget category (**Low/Medium/High**)

👉 If no direct options are available, clearly say so and recommend checking in real-time.

📊 **At the end**, include:
- A comparison table with min 3 options per mode (flight, train, bus) in **Markdown table format**
- A short suggestion on which mode is best based on price and travel time

⚠️ Use only trusted platforms (Skyscanner, MakeMyTrip, IRCTC, RedBus, etc.)
✅ Use **Markdown formatting**: emojis, **bold text**, clickable links, and tables.
`;

    // 🤖 Gemini API call
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // or "gemini-2.5-pro" if supported in your access
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ success: true, text });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return res.status(500).json({ error: "Gemini API failed. Try again later." });
  }
};
