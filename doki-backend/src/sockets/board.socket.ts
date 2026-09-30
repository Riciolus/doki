import { Server, Socket } from "socket.io";

export function registerBoardSocketHandlers(io: Server, socket: Socket) {
  socket.on("join_board", ({ boardId }: { boardId: string }) => {
    socket.join("board:" + boardId);
    console.log(`Socket ${socket.id} joined room board:${boardId}`);
  });

  socket.on("leave_board", ({ boardId }: { boardId: string }) => {
    socket.leave("board:" + boardId);
    console.log(`Socket ${socket.id} left room board:${boardId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
}
