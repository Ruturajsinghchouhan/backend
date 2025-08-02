import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your real API key from https://makersuite.google.com/app/apikey
const genAI = new GoogleGenerativeAI("AIzaSyARIHmFiqBpN6zr6mQDFJ4V5L3nL-W3cuo");

export const getTravelData = async (req, res) => {
  const { from, to, date } = req.body;

const prompt = `You're a smart AI travel assistant.

Generate 3 best travel options for a trip from **"${from}" to "${to}"** on **"${date}"**.

---

### ✈️ Flight  
- Airline name  
- Price range (₹)  
- Duration  
- Booking link (from [Skyscanner](https://www.skyscanner.co.in), [MakeMyTrip](https://www.makemytrip.com), or [Goibibo](https://www.goibibo.com))  
- Budget category: **Low**, **Medium**, or **High**

### 🚆 Train  
- Train name & number  
- Classes & approximate prices  
- Duration  
- Booking link (from [IRCTC](https://www.irctc.co.in) or [Trainman](https://www.trainman.in))  
- Budget category: **Low**, **Medium**, or **High**

### 🚌 Bus  
- Type: Direct or Connecting  
- Price range (₹)  
- Duration  
- Booking link (from [RedBus](https://www.redbus.in) or [AbhiBus](https://www.abhibus.com))  
- Budget category: **Low**, **Medium**, or **High**

🛑 If any **mode of travel is not directly available**, clearly say "**Not Available**" and suggest verifying in real time.

---

### 📊 Summary Comparison Table  
Create a **markdown table** comparing at least **one Low, Medium, and High** budget option for each travel mode:

| Mode   | Budget  | Price Range | Duration | Example Provider |
|--------|---------|-------------|----------|------------------|
| Flight | Low     | ₹...        | ... hrs  | ...              |
| Train  | Medium  | ₹...        | ... hrs  | ...              |
| Bus    | High    | ₹...        | ... hrs  | ...              |

---

### 📄 Documents Required for Travel  
- **Government ID** (e.g., Aadhar Card, Passport, Voter ID)  
- **Printed or digital tickets**  
- **Travel insurance** (if available)  
- **Student ID** or **Senior Citizen ID** (for concessions, if applicable)

---

### 🎒 Suggested Packing List  
- Clothes suitable for the weather at destination  
- Toiletries and personal hygiene items  
- Power bank and mobile charger  
- Water bottle & light snacks  
- Any required medicines  
- Travel pillow and earphones  
- Umbrella or sunscreen (seasonal)

---

### 💡 Final Suggestion  
Give a **short recommendation** on which mode is most cost-effective or time-saving for this trip.

Use proper **Markdown formatting**, emojis, bold text, and verified booking links from trusted travel platforms.
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
