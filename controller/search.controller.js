import { GoogleGenerativeAI } from "@google/generative-ai";
import AbortController from "abort-controller";

// Use hardcoded key for now
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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // Timeout (max wait 20s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const result = await model.generateContent(prompt, { signal: controller.signal });
    clearTimeout(timeoutId);

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ success: true, text });
  } catch (err) {
    console.error("❌ Gemini Error:", err.message || err);
    let msg = err.name === "AbortError"
      ? "Gemini API timed out. Try again."
      : "Gemini API failed. Try again later.";

    return res.status(500).json({ error: msg });
  }
};
