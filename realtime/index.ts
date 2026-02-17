const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
import { setupSocketHandlers } from "./socket/handlers";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: any) => {
  setupSocketHandlers(io, socket);
});

app.get("/", (req: any, res: any) => {
  res.send("Realtime server running");
});

httpServer.listen(3001, () => {
  console.log("Server running on port 3001");
});
