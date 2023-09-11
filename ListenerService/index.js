const { Server } = require("socket.io");
const crypto = require("crypto");
const express = require("express");
const http = require("http");

// Replace with the address of your MongoDB instance
const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const mongoURL = "mongodb://localhost:27017";
const dbName = "timeseriesdb";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const iv = "i-initialization";
// Function to decrypt a message using AES-256-CTR
function decryptMessage(encryptedMessage, key) {
  const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
  let decryptedMessage = decipher.update(encryptedMessage, "hex", "utf8");
  decryptedMessage += decipher.final("utf8");
  return decryptedMessage;
}

// Socket.io event handling
io.on("connection", (socket) => {
  console.log("Listener connected.");

  socket.on("dataStream", async (encryptedData) => {
    const messages = encryptedData.split("|");
    try {
      const client = new MongoClient(mongoURL);
      // await client.connect();
      // Select the database
      const db = client.db(dbName);
      const database = client.db("timeseriesdb");
      const collection = database.collection("timeseries");

      messages.forEach(async (encryptedMessage) => {
        // Decrypt the payload
        const decryptedData = decryptMessage(
          encryptedMessage,
          "adnan-tech-programming-computers"
        );

        try {
          // Parse the decrypted JSON data
          const data = JSON.parse(decryptedData);

          // Save the data to MongoDB as time-series data
          data.timestamp = new Date(); // Add timestamp
          console.log(data);
          // const result = await collection.insertOne(data);
          console.log("Data saved to MongoDB:", data);
        } catch (error) {
          console.error("Error parsing JSON data:", error);
        }
      });

      // Close the MongoDB connection
      client.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  });
});

// Start the server
server.listen(3005, () => {
  console.log("Listener Service is running on port 3005.");
});
