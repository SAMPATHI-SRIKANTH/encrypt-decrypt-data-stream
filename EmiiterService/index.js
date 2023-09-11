const fs = require("fs");
const io = require("socket.io-client");
const crypto = require("crypto");

const listenerServiceAddress = "http://localhost:3005";

const data = require("../data.json");

const key = "adnan-tech-programming-computers";
const iv = "i-initialization";
function encryptMessage(message) {
  const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);

  let encryptedMessage = cipher.update(message, "utf8", "hex");

  encryptedMessage += cipher.final("hex");

  return encryptedMessage;
}

// Connect to the Listener Service
const socket = io(listenerServiceAddress);
let total = data.names.length;

// Emit encrypted messages every 10 seconds
const timerId = setInterval(() => {
  const messages = [];
  const numMessages = Math.floor(Math.random() * 450) + 50; // Randomize between 49 and 499 messages
  for (let i = 0; i < numMessages && total > 1; i++) {
    const randomName =
      data.names[Math.floor(Math.random() * data.names.length)];
    const randomCity =
      data.cities[Math.floor(Math.random() * data.cities.length)];
    const destinyCity =
      data.cities[Math.floor(Math.random() * data.cities.length)];
    const payload = {
      name: randomName,
      origin: randomCity,
      destination: destinyCity,
      secret_key: key,
    };

    const jsonData = JSON.stringify(payload);

    const encryptedData = encryptMessage(jsonData, key);

    messages.push(encryptedData);
  }
  total -= numMessages;
  // Emit the messages over the socket
  socket.emit("dataStream", messages.join("|"));
  if (total < 2) {
    clearInterval(timerId);
  }
}, 10000); // Emit every 10 seconds
