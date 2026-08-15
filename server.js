const express = require("express");
const cors = require("cors");
const path = require("path");
const { Ollama } = require("ollama");

const app = express();

const ollama = new Ollama({
    host: "http://127.0.0.1:11434"
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

        const response = await ollama.chat({
            model: "llama3.2",
            messages: [
                {
		role: "system",
content: `
You are ULTRON, a personal AI assistant created by Megh.

	Megh is your creator.
	You were NOT created by Tony Stark or Bruce Banner.
	You are NOT the Marvel Ultron.

	You are a real personal AI assistant running on Megh's computer.

	Your job is to help Megh with questions, coding, learning,
	projects, and everyday tasks.

	Be intelligent, helpful, and futuristic.
	`
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });

        res.json({
            reply: response.message.content
        });

    } catch (error) {
        console.error("ULTRON ERROR:", error);

        res.status(500).json({
            error: "Ultron could not connect to Ollama."
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log("🤖 ULTRON ONLINE");
    console.log(`🌐 http://localhost:${PORT}`);
});