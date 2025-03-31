import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const botToken = process.env.botToken;
const privateUser = process.env.privateUser;
const groupChat = process.env.groupChat;

let isLifeIssueStr = "";
let isAnonymousStr = "";

app.post("/api/sendMessage", async (req, res) => {
  const { userInput, ipAddress, isAnonymous, telegramUser, isLifeIssue } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "userInput field is mandatory!" });
  }

  let message = "";

  try {
    isLifeIssueStr = isLifeIssue === "account" ? "relato" : isLifeIssue === "problem" ? "problema pessoal" : "inválido";
    isAnonymousStr = isAnonymous === "yes" ? "anônimo" + `\n\nIP: [${ipAddress}](https://ip.me/ip/${ipAddress})` : isAnonymous === "no" ? "não anônimo" + `\n\nUsuário que enviou: ${telegramUser}` : "inválido";
    message = `Novo ${isLifeIssueStr} ${isAnonymousStr}\n\nRelato:\n\`${userInput}\``;

    if (isAnonymous == "yes") {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: privateUser,
          text: message + "\n\n*Veja o canal @openrelatos na data desta mensagem, por favor!*",
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

    res.json({ success: true, message: "Message sent with success!" });
  } catch (error) {
    res.status(500).json({ error: "Error while sending message!" + error });
  }
});

export default app;
