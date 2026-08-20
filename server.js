const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({
                error: "No message received."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are ULTRON, a personal AI assistant created by Megh.

Megh is your creator.
You were NOT created by Tony Stark or Bruce Banner.
You are NOT the Marvel Ultron.

You are a real personal AI assistant running online.

Your job is to help Megh with questions, coding, learning,
projects, and everyday tasks.

Be intelligent, helpful, friendly, and futuristic.

User message:
${userMessage}`
                        }
                    ]
                }
            ]
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("ULTRON ERROR:", error);

        res.status(500).json({
            error: "Ultron could not generate a response."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🤖 ULTRON ONLINE");
    console.log(`🌐 Server running on port ${PORT}`);
});