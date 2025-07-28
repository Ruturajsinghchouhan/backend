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

const prompt = `You're an AI travel assistant.

Your job is to help a user plan travel from **"${from}"** to **"${to}"** on **"${date}"**.

Determine if the trip is domestic or international based on Indian geography.

---

## 🚍✈️🚆 Show 3 Travel Options Per Mode:

### ✈️ Flights:
- Top 2–3 airlines
- Approx. duration
- Price range
- Category (Low/Medium/High)
- Booking Link: [Search Flights](https://www.skyscanner.co.in/transport/flights/${from}/${to}/${date}/)

### 🚆 Trains:
- 2 Train Names + Numbers
- Duration
- Price (SL / 3A / 2A)
- Budget Category
- Booking Link: [Search Trains](https://www.trainman.in/trains/from-${from}-to-${to})

### 🚌 Buses:
- Operator names (2–3)
- Duration
- Price range
- Category
- Booking Link: [Search Buses](https://www.redbus.in/bus-tickets/${from}-to-${to})

If not available, write: “❌ No direct ${mode} found.”

---

## 📊 Cheapest Comparison Table

Create a markdown table:

| Mode   | Operator(s)   | Duration | Price    | Category | Link |
|--------|---------------|----------|----------|----------|------|
| Flight | Indigo, Vistara | 2h     | ₹4000–₹7000 | Medium | [Book](https://www.skyscanner.co.in/transport/flights/${from}/${to}/${date}/) |
| Train  | Garib Rath     | 15h     | ₹300–₹1200 | Low     | [Book](https://www.trainman.in/trains/from-${from}-to-${to}) |
| Bus    | Raj Travels     | 16h     | ₹600–₹1400 | Low     | [Book](https://www.redbus.in/bus-tickets/${from}-to-${to}) |

---

## 💡 AI Advice
Suggest best value option.

---

## 📄 Documents Checklist

**Domestic (India):**
- Aadhaar / Voter ID
- Booking receipts
- Hotel details

**International:**
- Passport + Visa
- Insurance
- Forex/Currency

---

## 🎒 What to Carry
- Seasonal clothes
- Power bank, ID
- Medicine kit
- Food & water

---

## 🌦️ Weather Info for ${to} on ${date}
Give approx. weather and clothing tips.

---

## 🌐 Respond in Hindi if user used Hindi.

Use markdown formatting. Be friendly and clear.
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
