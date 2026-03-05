import { Server } from "socket.io";

export let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join:group", (groupId: string) => {
      socket.join(groupId);
    });

    socket.on("leave:group", (groupId: string) => {
      socket.leave(groupId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
