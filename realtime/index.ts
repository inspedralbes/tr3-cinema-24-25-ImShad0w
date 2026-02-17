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

//TODO: 
//  1. Create users and events lists
//  2. Create a "queue" like system with socket.io
//  3. Make socket.io reserve the seats via laravel, not frontend workarounds

const events = [];
const users = [];
const queues = [];

io.on("connection", (socket: any) => {
  console.log("User connected via socket: ", socket.id);

  const newUser = {
    socketId: socket.id,
    eventId: null,
    selectedSeats: []
  };
  users.push(newUser);
  console.log("New user added to users array:", newUser);
  console.log("Total users:", users.length);

  socket.on("selectSeat", (data: any) => {
    console.log(data);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected via socket: ", socket.id);
    const userIndex = users.findIndex((u: any) => u.socketId === socket.id);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      console.log("User removed from users array");
      console.log("Total users:", users.length);
    }
  });
});

app.get("/", (req: Request, res: any) => {
  res.send("Hello world");
})

httpServer.listen(3001);
