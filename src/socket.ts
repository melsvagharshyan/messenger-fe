import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  "https://messenger-be-production.up.railway.app"
);
