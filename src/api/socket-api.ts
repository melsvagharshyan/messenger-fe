import { Socket, io } from "socket.io-client";

class SocketApi {
  static socket: null | Socket = null;

  static createConnection(): void {
    this.socket = io("http://localhost:8888");

    this.socket.on("connect", () => {
      console.log("connected");
    });

    this.socket.on("disconnect", () => {
      console.log("disconnect");
    });
  }
}

export default SocketApi;
