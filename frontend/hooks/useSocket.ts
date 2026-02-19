import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

type SocketEventHandlers = {
  onSeatsUpdated?: (data: any) => void;
  onReserveSuccess?: (data: any) => void;
  onReserveError?: (data: any) => void;
  onBuySuccess?: (data: any) => void;
  onBuyError?: (data: any) => void;
  onReservationExpired?: (data: any) => void;
};

export function useSocket(handlers: SocketEventHandlers = {}) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);
  const [isConnected, setIsConnected] = useState(false);

  // Update handlers ref without triggering re-render
  handlersRef.current = handlers;

  useEffect(() => {
    // Only create socket once
    if (socketRef.current) return;

    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketRef.current.on("seatsUpdated", (data: any) => {
      handlersRef.current.onSeatsUpdated?.(data);
    });

    socketRef.current.on("reserveSuccess", (data: any) => {
      handlersRef.current.onReserveSuccess?.(data);
    });

    socketRef.current.on("reserveError", (data: any) => {
      handlersRef.current.onReserveError?.(data);
    });

    socketRef.current.on("buySuccess", (data: any) => {
      handlersRef.current.onBuySuccess?.(data);
    });

    socketRef.current.on("buyError", (data: any) => {
      handlersRef.current.onBuyError?.(data);
    });

    socketRef.current.on("reservationExpired", (data: any) => {
      handlersRef.current.onReservationExpired?.(data);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const selectSeat = (seatId: number) => {
    emit("selectSeat", {
      socket: socketRef.current?.id,
      data: seatId,
    });
  };

  const removeSeat = (seatId: number) => {
    emit("removeSeat", {
      socket: socketRef.current?.id,
      seatId: seatId,
    });
  };

  const reserveSeats = (seatIds: number[], userId: string) => {
    emit("reserveSeats", { seatIds, userId });
  };

  const buySeats = () => {
    emit("buySeats", {});
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    selectSeat,
    removeSeat,
    reserveSeats,
    buySeats,
  };
}
