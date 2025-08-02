import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your real API key from https://makersuite.google.com/app/apikey
const genAI = new GoogleGenerativeAI("AIzaSyARIHmFiqBpN6zr6mQDFJ4V5L3nL-W3cuo");

export const getTravelData = async (req, res) => {
  const { from, to, date } = req.body;

const prompt = `You're a travel assistant.

Give me 3 best travel options from "${from}" to "${to}" for the date "${date}".

Include:
✈️ **Flight** – airline, price range, duration, booking link (from platforms like [Skyscanner](https://www.skyscanner.co.in), [MakeMyTrip](https://www.makemytrip.com), [Goibibo](https://www.goibibo.com)), and budget category (**Low/Medium/High**)  
🚆 **Train** – train name & number, classes & prices, duration, booking link (from [IRCTC](https://www.irctc.co.in) or [Trainman](https://www.trainman.in)), and budget category  (**Low/Medium/High**)
🚌 **Bus** – direct or connecting, price range, duration, booking link (from [RedBus](https://www.redbus.in), [AbhiBus](https://www.abhibus.com)), and budget category(**Low/Medium/High**)
**In not direct train and flight available say no available check and verfy to real time **
**End with:**
- A summary comparison table of minimum three flights,trains,buses as for every mode of transport mode low medium and high (in markdown table format) 
- A short suggestion on which mode to prefer based on price and time

👉 Use **Markdown** formatting (including bold text, emojis, links, and markdown tables).
Ensure all booking links point to trusted platforms that offer **discounted fares**, not generic or placeholder URLs.
`;


try {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Just return raw text as string for now
  res.json({ text }); 
} catch (err) {
  console.error("Gemini error:", err.message);
  res.status(500).json({ error: "Gemini API failed" });
}

};
