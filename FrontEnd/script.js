const express = require("express");
const http = require("http");
const socketIO = require("socket.io-client");

const app = express();
const server = http.createServer(app);

// Replace with the address of your Listener Service
const listenerServiceAddress = "http://localhost:3000";

// Serve a simple HTML page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const socket = socketIO(listenerServiceAddress);

// Socket.io event handling
socket.on("connect", () => {
  console.log("Connected to Listener Service.");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Listener Service.");
});

socket.on("dataStream", (data) => {
  console.log("Received data:", data);
  // You can update the frontend to display the received data in real-time.
});

// Start the server
server.listen(4000, () => {
  console.log("Frontend Application is running on port 4000.");
});
