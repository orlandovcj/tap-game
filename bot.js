const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Token do seu bot do Telegram
const TOKEN = 'YOUR_BOT_TOKEN';
const WEBHOOK_URL = 'YOUR_SERVER_URL/bot'; // URL pública do seu servidor

const bot = new TelegramBot(TOKEN);
const app = express();

// Configuração do Webhook
bot.setWebHook(`${WEBHOOK_URL}/bot${TOKEN}`);

// Endpoint para receber dados do Web App
app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Manipula o comando /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Play Tap Game',
                    web_app: { url: 'YOUR_WEB_APP_URL/index.html' }
                }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Clique no botão abaixo para jogar o Tap Game!', opts);
});

// Manipula dados enviados do Web App
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app_data.data);
    bot.sendMessage(chatId, `Você clicou ${data.tapCount} vezes!`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
