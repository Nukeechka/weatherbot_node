const TelegramBot = require('node-telegram-bot-api');

const token = '7910839818:AAFqEDkI4sSNyzQZOkJCnXCxiy3yzcXxQBQ';
const openWeatherAPI = '82acc9bcd90f1cd5a6f918caf245204e';

const bot = new TelegramBot(token, { polling: true });

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${openWeatherAPI}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

bot.onText('/start', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    'Приветсвую тебя! Я бот, который поможет узнать тебе данные о погоде любого города.\nВведи название города: например Париж',
  );
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  getWeather(msg.text).then((data) => {
    if (data == null) {
      bot.sendMessage(chatId, 'Не существующий город или ошибка сети!');
      return;
    }

    bot.sendMessage(
      chatId,
      `Погода на данный момент:\n
      Город: ${data.name}\n
      Температура: ${data.main.temp} °C\n
      Влажность: ${data.main.humidity}%\n
      Описание погоды: ${data.weather[0].description}`,
    );
  });
});

// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });
