import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// ===== AUTH =====
app.post("/register", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  users.push(req.body);
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.json({ msg: "Registered" });
});

app.post("/login", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  const user = users.find(
    u => u.username === req.body.username && u.password === req.body.password
  );
  res.json({ success: !!user });
});

// ===== MEDICINES =====
app.post("/add-med", (req, res) => {
  const meds = JSON.parse(fs.readFileSync("medicines.json"));
  meds.push(req.body);
  fs.writeFileSync("medicines.json", JSON.stringify(meds));
  res.send("Added");
});

app.get("/get-med", (req, res) => {
  const meds = JSON.parse(fs.readFileSync("medicines.json"));
  res.json(meds);
});

// ===== AI MEDICINE INFO =====
app.post("/ai-info", async (req, res) => {
  const { name, dosage } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_OPENAI_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Explain ${name} (${dosage}) uses, benefits, side effects, risks simply`
          }
        ]
      })
    });

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });

  } catch {
    res.json({ result: "AI error" });
  }
});

// ===== AI CHAT =====
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_OPENAI_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a friendly health assistant." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.listen(PORT, () => console.log("Running on", PORT));