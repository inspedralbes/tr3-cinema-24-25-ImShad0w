import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

type SocketEventHandlers = {
  onSeatsUpdated?: (data: any) => void;
  onReserveSuccess?: (data: any) => void;
  onReserveError?: (data: any) => void;
  onBuySuccess?: (data: any) => void;
  onBuyError?: (data: any) => void;
  onReservationExpired?: (data: any) => void;
  onEnterEventSuccess?: (data: any) => void;
  onEnterEventError?: (data: any) => void;
  onEnterQueue?: (data: any) => void;
  onQueuePromoted?: (data: any) => void;
  onQueuePositionUpdate?: (data: any) => void;
  onUserJoinedEvent?: (data: any) => void;
  onUserLeftEvent?: (data: any) => void;
};

// Singleton socket instance
let socketInstance: Socket | null = null;
let isConnecting = false;

function getSocket(): Socket {
  if (!socketInstance) {
    console.log("Creating NEW socket instance");
    socketInstance = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
}

export function useSocket(handlers: SocketEventHandlers = {}) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);
  const [isConnected, setIsConnected] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [eventId, setEventId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  handlersRef.current = handlers;

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    isConnecting = true;

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      isConnecting = false;
    };

    const onConnectError = (err: Error) => {
      console.log("Socket connection error:", err.message);
      isConnecting = false;
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      setInQueue(false);
      setQueuePosition(0);
      setActiveUsers([]);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);

    // Check if already connected
    if (socket.connected) {
      setIsConnected(true);
      isConnecting = false;
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("seatsUpdated", (data: any) => {
      handlersRef.current.onSeatsUpdated?.(data);
    });

    socket.on("reserveSuccess", (data: any) => {
      handlersRef.current.onReserveSuccess?.(data);
    });

    socket.on("reserveError", (data: any) => {
      handlersRef.current.onReserveError?.(data);
    });

    socket.on("buySuccess", (data: any) => {
      handlersRef.current.onBuySuccess?.(data);
    });

    socket.on("buyError", (data: any) => {
      handlersRef.current.onBuyError?.(data);
    });

    socket.on("reservationExpired", (data: any) => {
      handlersRef.current.onReservationExpired?.(data);
    });

    socket.on("enterEventSuccess", (data: any) => {
      console.log("enterEventSuccess received");
      setInQueue(false);
      setQueuePosition(0);
      setActiveUsers(data.activeUsers || []);
      handlersRef.current.onEnterEventSuccess?.(data);
    });

    socket.on("enterEventError", (data: any) => {
      console.log("enterEventError received");
      handlersRef.current.onEnterEventError?.(data);
    });

    socket.on("enterQueue", (data: any) => {
      console.log("enterQueue received");
      setInQueue(true);
      setEventId(data.eventId);
      setQueuePosition(data.position);
      handlersRef.current.onEnterQueue?.(data);
    });

    socket.on("queuePromoted", (data: any) => {
      console.log("queuePromoted received");
      setInQueue(false);
      setQueuePosition(0);
      handlersRef.current.onQueuePromoted?.(data);
    });

    socket.on("queuePositionUpdate", (data: any) => {
      console.log("queuePositionUpdate received:", data);
      setQueuePosition(data.position);
      handlersRef.current.onQueuePositionUpdate?.(data);
    });

    socket.on("userJoinedEvent", (data: any) => {
      console.log("userJoinedEvent received:", data);
      setActiveUsers(data.activeUsers || []);
      handlersRef.current.onUserJoinedEvent?.(data);
    });

    socket.on("userLeftEvent", (data: any) => {
      console.log("userLeftEvent received:", data);
      setActiveUsers(data.activeUsers || []);
      handlersRef.current.onUserLeftEvent?.(data);
    });

    return () => {
      socket.off("seatsUpdated");
      socket.off("reserveSuccess");
      socket.off("reserveError");
      socket.off("buySuccess");
      socket.off("buyError");
      socket.off("reservationExpired");
      socket.off("enterEventSuccess");
      socket.off("enterEventError");
      socket.off("enterQueue");
      socket.off("queuePromoted");
      socket.off("queuePositionUpdate");
      socket.off("userJoinedEvent");
      socket.off("userLeftEvent");
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    const socket = socketRef.current;
    console.log("Emit called:", event, "socket exists:", !!socket, "connected:", socket?.connected);
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.log("Cannot emit - socket not connected");
    }
  }, []);

  const leaveEvent = useCallback(() => {
    setActiveUsers([]);
    emit("leaveEvent", {});
  }, [emit]);

  const enterEvent = useCallback((eventId: string) => {
    console.log("enterEvent called with:", eventId);
    setEventId(eventId);
    emit("enterEvent", { eventId });
  }, [emit]);

  const selectSeat = useCallback((seatId: number) => {
    emit("selectSeat", {
      socket: socketRef.current?.id,
      data: seatId,
    });
  }, [emit]);

  const removeSeat = useCallback((seatId: number) => {
    emit("removeSeat", {
      socket: socketRef.current?.id,
      seatId: seatId,
    });
  }, [emit]);

  const reserveSeats = useCallback((seatIds: number[], userId: string) => {
    emit("reserveSeats", { seatIds, userId });
  }, [emit]);

  const buySeats = useCallback(() => {
    emit("buySeats", {});
  }, [emit]);

  return {
    socket: socketRef.current,
    isConnected,
    inQueue,
    queuePosition,
    eventId,
    activeUsers,
    emit,
    enterEvent,
    leaveEvent,
    selectSeat,
    removeSeat,
    reserveSeats,
    buySeats,
  };
}
