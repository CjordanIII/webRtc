const express = require("express");
const expressWs = require("express-ws");
require("dotenv").config();
const cors = require("cors");

const app = express();
const expressWsInstance = expressWs(app);

app.use(cors());

app.ws("/websocket", (ws, req) => {
  // WebSocket connection established at /websocket route
  console.log("Connection opened");

  ws.on("message", (message) => {
   

    // Respond to the client with a message
    ws.send(message);
  });

  // Handle WebSocket disconnections
  ws.on("close", () => {
    console.log("WebSocket closed");
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
