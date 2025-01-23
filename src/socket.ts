import { io, Socket } from "socket.io-client";

const apiKey = import.meta.env.VITE_SOCKET_URL;

export const socket: Socket = io(apiKey);
