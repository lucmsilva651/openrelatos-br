import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const botToken = process.env.botToken;
const privateUser = process.env.privateUser;
const groupChat = process.env.groupChat;

app.post("/api/sendMessage", async (req, res) => {
  const { userInput, isAnonymous, telegramUser } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "O campo userInput é obrigatório!" });
  }

  const ip = await (await fetch("https://api.ipify.org?format=json")).json();
  let message = "";

  try {
    if (isAnonymous === "No") {
      message = `Novo relato não anônimo\n\nUsuário que enviou: ${telegramUser}\n\nRelato:\n\`${userInput}\``;
    } else {
      message = `Novo relato anônimo\n\nIP: [${ip.ip}](https://ip.me/ip/${ip.ip})\n\nRelato:\n\`${userInput}\``;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: privateUser,
          text: message + `\n\nUsuário que enviou: ${telegramUser}\n\n*Veja o canal @openrelatos na data desta mensagem, por favor!*`,
          parse_mode: "Markdown",
          disable_web_page_preview: true
        })
      });
    }

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: groupChat,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true
      })
    });

    res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao enviar a mensagem!" });
  }
});

export default app;
