const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const welcome = document.querySelector(".welcome");

function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = `message ${type}`;

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;

    message.appendChild(content);
    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) return;

    if (welcome) {
        welcome.style.display = "none";
    }

    addMessage(message, "user");

    messageInput.value = "";

    addMessage("Ultron is thinking...", "ai");

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        const thinkingMessages =
            document.querySelectorAll(".message.ai");

        const lastMessage =
            thinkingMessages[thinkingMessages.length - 1];

        if (lastMessage) {
            lastMessage.querySelector(".message-content").textContent =
                data.reply || "I couldn't generate a response.";
        }

    } catch (error) {
        console.error(error);

        const thinkingMessages =
            document.querySelectorAll(".message.ai");

        const lastMessage =
            thinkingMessages[thinkingMessages.length - 1];

        if (lastMessage) {
            lastMessage.querySelector(".message-content").textContent =
                "Connection error. Ultron's server is offline.";
        }
    }
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});