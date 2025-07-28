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

   const prompt = `You're a smart AI travel assistant.

Your job is to help a user plan travel from **"${from}"** to **"${to}"** on **"${date}"**.

First, **detect whether the trip is domestic or international** based on the origin and destination. If international, provide appropriate suggestions and document checklist.

---

### ✈️🚆🚌 Show 3 Best Travel Options:

Provide the **top 3 travel options** for each transport mode:

#### ✈️ **Flight**
- Airlines (2–3)
- Duration
- Price Range
- Budget Category (Low / Medium / High)
- Booking Link: [Skyscanner](https://www.skyscanner.co.in), [MakeMyTrip](https://www.makemytrip.com)

#### 🚆 **Train**
- Train Name & Number (2 options)
- Duration
- Price by Class (SL / 3A / 2A)
- Budget Category
- Booking Link: [IRCTC](https://www.irctc.co.in), [Trainman](https://www.trainman.in)

#### 🚌 **Bus**
- Operator Names (2–3)
- Duration
- Price Range
- Budget Category
- Booking Link: [RedBus](https://www.redbus.in), [AbhiBus](https://www.abhibus.com)

⚠️ If no direct flight or train is available, write:
**"❌ No direct option available. Please check real-time on booking sites."**

---

### 📊 Cheapest Travel Comparison Table

Create a **markdown table** comparing 3 options:

| Mode   | Operator(s)      | Duration | Price Range | Category | Booking Link |
|--------|------------------|----------|-------------|----------|--------------|
| Flight | Example Airlines | 2h       | ₹4000–₹8000 | Medium   | [Skyscanner](https://www.skyscanner.co.in) |
| Train  | Example Train    | 15h      | ₹500–₹2500  | Low      | [IRCTC](https://www.irctc.co.in) |
| Bus    | Example Bus Co.  | 18h      | ₹600–₹1400  | Low-Med  | [RedBus](https://www.redbus.in) |

---

### 💡 AI Trip Advice

Give a short suggestion:  
**Example** – “✅ Take the train: cheaper and not much longer than the bus.”

---

### 📄 Document Checklist

**If Domestic Travel (India):**
- ✅ Govt ID (Aadhaar, PAN, Driving License)
- ✅ Tickets (Printed or Mobile)
- ✅ Hotel Booking Confirmation
- ✅ COVID Vaccination Certificate (if needed)

**If International Travel:**
- ✅ Passport (valid 6+ months)
- ✅ Visa (if required)
- ✅ Travel Insurance
- ✅ Return Ticket
- ✅ Hotel Booking
- ✅ Currency or Forex Card

---

### 🎒 What to Carry List
- Clothes (weather-based)
- Mobile charger + power bank
- Medicines (basic)
- Water + Snacks
- Documents folder

---

### 🌦️ Weather Forecast for ${to} on ${date}
Provide weather details (temperature, sun/rain/cloud) and advice.  
**Example**: “🌧️ 28°C and rainy. Carry umbrella and raincoat.”

---

### 🌐 Respond in Hindi (Optional)

If user prefers Hindi, give the **same information in Hindi**. Detect automatically from input or let the user choose.

---

👉 Use **Markdown formatting** – bold headers, emojis, bullet points, and tables.  
👉 Keep tone friendly, helpful, and travel-expert style.  
👉 All booking links must be real and from trusted platforms.

Your response should look like a well-organized **AI travel guide**.
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
