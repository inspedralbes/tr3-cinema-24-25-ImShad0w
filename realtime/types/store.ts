// Data structures and interfaces
export interface Event {
  eventId: string;
  activeUsers: string[];
  maxCapacity: number;
}

export interface User {
  socketId: string;
  eventId: string | null;
  selectedSeats: number[];
}

export interface Queue {
  eventId: string;
  waitingUsers: string[];
}

// Data storage
export const events: Event[] = [];
export const users: User[] = [];
export const queues: Queue[] = [];
