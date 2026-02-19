import { events, users, queues } from "../types/store";
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

export function setupSocketHandlers(io: Server, socket: Socket): void {
  console.log("User connected: ", socket.id);

  // Create user on connect
  users.push({
    socketId: socket.id,
    eventId: null,
    selectedSeats: [],
    reservedSeats: [],
    reservationTime: null
  });

  console.log("Total users:", users.length);

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

        // Set timer to release seats after 5 minutes
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
        // Clear the timer
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

    // Clear timer on disconnect
    const timer = userTimers.get(socket.id);
    if (timer) {
      clearTimeout(timer);
      userTimers.delete(socket.id);
    }

    // Release reserved seats on disconnect (wait for Laravel)
    const user = users.find(u => u.socketId === socket.id);
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
