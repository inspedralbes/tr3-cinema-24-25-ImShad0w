const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
import { setupSocketHandlers } from "./socket/handlers";
import { events } from "./types/store";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

async function syncEventsOnStartup() {
  try {
    const response = await fetch("http://cinema_backend:8000/api/events");
    if (response.ok) {
      const apiEventsData: any = await response.json();

      // Handle both array and object responses
      const eventsArray = Array.isArray(apiEventsData) ? apiEventsData : (apiEventsData.data || []);

      eventsArray.forEach((event: any) => {
        events.push({
          eventId: String(event.id),
          activeUsers: [],
          maxCapacity: 5
        });
      });

      console.log(`Synced ${eventsArray.length} events on startup`);
    }
  } catch (error) {
    console.error("Failed to sync events on startup:", error);
  }
}

io.on("connection", (socket: any) => {
  setupSocketHandlers(io, socket);
});

app.get("/", (req: any, res: any) => {
  res.send("Realtime server running");
});

syncEventsOnStartup().then(() => {
  httpServer.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
