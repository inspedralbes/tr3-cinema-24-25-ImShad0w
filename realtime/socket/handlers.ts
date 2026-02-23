import { events, users, queues, getEventRoom, getQueueRoom } from "../types/store";
import type { Server, Socket } from "socket.io"

const RESERVATION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const userTimers: Map<string, NodeJS.Timeout> = new Map();

async function releaseSeats(io: Server, socket: Socket, user: any) {
  if (user.reservedSeats.length > 0) {
    const seatIds = user.reservedSeats;

    try {
      const response = await fetch("http://cinema_backend:8000/api/seats/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_ids: seatIds,
        })
      });

      if (response.ok) {
        user.reservedSeats = [];
        user.reservationTime = null;

        io.emit("seatsUpdated", {
          seatIds: seatIds,
          status: "available"
        });

        socket.emit("reservationExpired", {
          message: "Your reservation has expired",
          seatIds: seatIds
        });

        console.log(`Released seats for user ${socket.id}:`, seatIds);
      } else {
        console.error("Failed to release seats in database:", response.status);
      }
    } catch (error) {
      console.error("Error releasing seats:", error);
    }
  }
}

function promoteNextFromQueue(io: Server, eventId: string) {
  const queue = queues.find(q => q.eventId === eventId);
  const event = events.find(e => e.eventId === eventId);

  if (!queue || !event || queue.waitingUsers.length === 0) return;

  if (event.activeUsers.length >= event.maxCapacity) return;

  const nextSocketId = queue.waitingUsers.shift();
  if (!nextSocketId) return;

  const nextUser = users.find(u => u.socketId === nextSocketId);
  if (!nextUser) return;

  nextUser.eventId = eventId;
  event.activeUsers.push(nextSocketId);

  io.to(nextSocketId).emit("queuePromoted", {
    eventId,
    message: "It's your turn! You can now access the event."
  });

  // Join the promoted user to the event room
  const promotedSocket = io.sockets.sockets.get(nextSocketId);
  if (promotedSocket) {
    promotedSocket.join(getEventRoom(eventId));
  }

  // Broadcast updated queue positions to remaining queue members
  queue.waitingUsers.forEach((socketId, index) => {
    io.to(socketId).emit("queuePositionUpdate", {
      eventId,
      position: index + 1,
      message: `Your position in queue is now ${index + 1}`
    });
  });
  
  // Clean up empty queues
  if (queue.waitingUsers.length === 0) {
    const queueIndex = queues.findIndex(q => q.eventId === eventId);
    if (queueIndex !== -1) {
      queues.splice(queueIndex, 1);
    }
  }

  console.log(`User ${nextSocketId} promoted from queue to event ${eventId}`);
}

async function syncEvents() {
  try {
    const response = await fetch("http://cinema_backend:8000/api/event");
    if (response.ok) {
      const apiEventsData: any = await response.json();

      // Handle both array and object responses
      const eventsArray = Array.isArray(apiEventsData) ? apiEventsData : (apiEventsData.data || []);

      eventsArray.forEach((event: any) => {
        const eventId = String(event.id);
        if (!events.find(e => e.eventId === eventId)) {
          events.push({
            eventId,
            activeUsers: [],
            maxCapacity: 5
          });
          console.log(`Synced event: ${eventId}`);
        }
      });
      console.log(`Synced ${eventsArray.length} events from API`);
    }
  } catch (error) {
    console.error("Failed to sync events:", error);
  }
}

export function setupSocketHandlers(io: Server, socket: Socket): void {
  console.log("User connected: ", socket.id);

  users.push({
    socketId: socket.id,
    eventId: null,
    selectedSeats: [],
    reservedSeats: [],
    reservationTime: null
  });

  console.log("Total users:", users.length);

  console.log(`Socket ${socket.id} registered enterEvent listener`);

  socket.on("enterEvent", async (data: any) => {
    console.log("enterEvent received from", socket.id, "with data:", data);
    const eventId = String(data.eventId);
    const user = users.find(u => u.socketId === socket.id);

    if (!user) {
      socket.emit("enterEventError", { message: "User not found" });
      return;
    }

    try {
      console.log("Fetching event from API...");
      const response = await fetch(`http://cinema_backend:8000/api/event/${eventId}`);
      console.log("API response status:", response.status);

      if (!response.ok) {
        console.log("Event not found in API");
        socket.emit("enterEventError", { message: "Event not found" });
        return;
      }

      console.log("Syncing events...");
      await syncEvents();

      let event = events.find(e => e.eventId === eventId);

      if (!event) {
        event = {
          eventId,
          activeUsers: [],
          maxCapacity: 5
        };
        events.push(event);
        console.log(`Created new event ${eventId}`);
      }

      // Clean up activeUsers to ensure they're all strings
      event.activeUsers = event.activeUsers.filter((u: any) => typeof u === "string");

      console.log(`Enter event ${eventId}, active users: ${event.activeUsers.length}, maxCapacity: ${event.maxCapacity}`);

      if (event.activeUsers.length >= event.maxCapacity) {
        let queue = queues.find(q => q.eventId === eventId);
        if (!queue) {
          queue = {
            eventId,
            waitingUsers: []
          };
          queues.push(queue);
        }

        if (!queue.waitingUsers.includes(socket.id)) {
          queue.waitingUsers.push(socket.id);
        }

        user.eventId = eventId;

        // Join the queue room for this event
        socket.join(getQueueRoom(eventId));

        socket.emit("enterQueue", {
          eventId,
          position: queue.waitingUsers.indexOf(socket.id) + 1,
          message: "Event is full, you have been added to the queue"
        });

        // Broadcast to queue room about updated positions
        queue.waitingUsers.forEach((socketId, index) => {
          io.to(socketId).emit("queuePositionUpdate", {
            eventId,
            position: index + 1,
            message: `Your position in queue is now ${index + 1}`
          });
        });

        console.log(`User ${socket.id} added to queue for event ${eventId}. Queue length: ${queue.waitingUsers.length}`);
        return;
      }

      user.eventId = eventId;
      event.activeUsers.push(socket.id);
      
      // Join the event room
      socket.join(getEventRoom(eventId));
      
      // Notify all users in the event about the new user
      io.to(getEventRoom(eventId)).emit("userJoinedEvent", {
        eventId,
        socketId: socket.id,
        activeUsers: event.activeUsers
      });
      
      console.log(`User ${socket.id} joined event ${eventId}. Active users: ${event.activeUsers.length}`);

      socket.emit("enterEventSuccess", {
        eventId,
        message: "Successfully joined event",
        activeUsers: event.activeUsers
      });

      console.log(`User ${socket.id} joined event ${eventId}`);
    } catch (error) {
      socket.emit("enterEventError", { message: "Failed to join event" });
    }
  });

  socket.on("syncEvents", async () => {
    await syncEvents();
    socket.emit("syncEventsSuccess", {
      message: "Events synced",
      count: events.length
    });
  });

  socket.on("leaveEvent", () => {
    const user = users.find(u => u.socketId === socket.id);
    
    if (user && user.eventId) {
      const event = events.find(e => e.eventId === user.eventId);
      const eventId = user.eventId;
      
      if (event) {
        event.activeUsers = event.activeUsers.filter((id: any) => id !== socket.id);
        
        // Leave the event room
        socket.leave(getEventRoom(eventId));
        
        // Notify remaining users in the event
        io.to(getEventRoom(eventId)).emit("userLeftEvent", {
          eventId,
          socketId: socket.id,
          activeUsers: event.activeUsers
        });
        
        console.log(`User ${socket.id} left event ${eventId}. Active users: ${event.activeUsers.length}`);
        
        // Promote next user from queue
        promoteNextFromQueue(io, eventId);
      }
      
      user.eventId = null;
      user.selectedSeats = [];
      
      socket.emit("leaveEventSuccess", {
        message: "Successfully left event"
      });
    }
  });

  socket.on("selectSeat", (data: any) => {
    const user = users.find(u => u.socketId === data.socket);
    if (!user) {
      console.log("No such user");
    }
    const seatExists = user?.selectedSeats.includes(data.data);

    if (seatExists) {
      console.log("Seat already selected")
    } else {
      user?.selectedSeats.push(data.data);
    };

    console.log("User seat selected count: ", user?.selectedSeats.length)
  });

  socket.on("removeSeat", (data: any) => {
    const user = users.find(u => u.socketId === data.socket);

    if (!user) return;

    user.selectedSeats = user.selectedSeats.filter(s => s != data.seatId);
  })

  socket.on("reserveSeats", async (data: any) => {
    const seatIds = data.seatIds;
    const user = users.find(u => u.socketId === socket.id)

    if (!user) {
      socket.emit("reserveError", { message: "User not found" });
      return;
    }

    if (!seatIds || seatIds.length === 0) {
      socket.emit("reserveError", { message: "No seats selected" });
      return;
    }

    try {
      const response = await fetch("http://cinema_backend:8000/api/seats/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_ids: seatIds,
        })
      });

      if (response.ok) {
        user.selectedSeats = [];
        user.reservedSeats = seatIds;
        user.reservationTime = Date.now();

        const timer = setTimeout(() => {
          const currentUser = users.find(u => u.socketId === socket.id);
          if (currentUser) {
            releaseSeats(io, socket, currentUser);
            userTimers.delete(socket.id);
          }
        }, RESERVATION_TIMEOUT);

        userTimers.set(socket.id, timer);

        io.emit("seatsUpdated", {
          seatIds: seatIds,
          status: "reserved"
        });

        socket.emit("reserveSuccess", {
          seatIds,
          expiresIn: RESERVATION_TIMEOUT
        });
      } else if (response.status === 422) {
        socket.emit("reserveError", {
          message: "Some seats are no longer available"
        });
      } else {
        socket.emit("reserveError", {
          message: "Failed to reserve seats"
        });
      }
    } catch (error) {
      socket.emit("reserveError", {
        message: "Failed to reserve seats"
      });
    }
  });

  socket.on("buySeats", async (data: any) => {
    const user = users.find(u => u.socketId === socket.id);

    if (!user || user.reservedSeats.length === 0) {
      socket.emit("buyError", { message: "No reserved seats to buy" });
      return;
    }

    const seatIds = user.reservedSeats;

    try {
      const response = await fetch("http://cinema_backend:8000/api/seats/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_ids: seatIds,
        })
      });

      if (response.ok) {
        const timer = userTimers.get(socket.id);
        if (timer) {
          clearTimeout(timer);
          userTimers.delete(socket.id);
        }

        user.reservedSeats = [];
        user.reservationTime = null;

        io.emit("seatsUpdated", {
          seatIds: seatIds,
          status: "sold"
        });

        socket.emit("buySuccess", { seatIds });
      } else {
        socket.emit("buyError", { message: "Failed to complete purchase" });
      }
    } catch (error) {
      socket.emit("buyError", { message: "Failed to complete purchase" });
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected: ", socket.id);

    const user = users.find(u => u.socketId === socket.id);
    const previousEventId = user?.eventId;

    if (user && user.eventId) {
      const event = events.find(e => e.eventId === user.eventId);
      if (event) {
        event.activeUsers = event.activeUsers.filter(id => id !== socket.id);
        
        // Leave the event room
        socket.leave(getEventRoom(user.eventId));
        
        // Notify remaining users in the event
        io.to(getEventRoom(user.eventId)).emit("userLeftEvent", {
          eventId: user.eventId,
          socketId: socket.id,
          activeUsers: event.activeUsers
        });
        
        console.log(`User ${socket.id} removed from event ${user.eventId}. Active users: ${event.activeUsers.length}`);

        promoteNextFromQueue(io, user.eventId);
      }
    }

    // Handle queue removal
    const queue = queues.find(q => q.waitingUsers.includes(socket.id));
    if (queue) {
      queue.waitingUsers = queue.waitingUsers.filter(id => id !== socket.id);
      
      // Leave the queue room
      socket.leave(getQueueRoom(queue.eventId));
      
      // Broadcast updated queue positions
      queue.waitingUsers.forEach((socketId, index) => {
        io.to(socketId).emit("queuePositionUpdate", {
          eventId: queue.eventId,
          position: index + 1,
          message: `Your position in queue is now ${index + 1}`
        });
      });
      
      // Clean up empty queues
      if (queue.waitingUsers.length === 0) {
        const queueIndex = queues.findIndex(q => q.eventId === queue.eventId);
        if (queueIndex !== -1) {
          queues.splice(queueIndex, 1);
        }
      }
    }

    const timer = userTimers.get(socket.id);
    if (timer) {
      clearTimeout(timer);
      userTimers.delete(socket.id);
    }

    if (user && user.reservedSeats.length > 0) {
      await releaseSeats(io, socket, user);
    }

    const index = users.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) {
      users.splice(index, 1);
      console.log("Total users:", users.length);
    }
  });
}
