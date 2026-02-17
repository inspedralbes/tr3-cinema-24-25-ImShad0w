const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: any) => {
  console.log("User connected via socket: ", socket.id);

  socket.on("message", (data: any) => {
    console.log(data);
  })
});

app.get("/", (req: Request, res: any) => {
  res.send("Hello world");
})

httpServer.listen(3001);
