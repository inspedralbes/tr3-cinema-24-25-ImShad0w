import { events, users, queues } from "../types/store";

export function setupSocketHandlers(io: any, socket: any): void {
  console.log("User connected: ", socket.id);

  // Create user on connect
  users.push({
    socketId: socket.id,
    eventId: null,
    selectedSeats: []
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

  socket.on("reserveSeats", () => {
    //TODO: Check via laravel if the seat is available and if so send a put/patch request to update seat status of said event
  })

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    const index = users.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) {
      users.splice(index, 1);
      console.log("Total users:", users.length);
    }
  });
}
