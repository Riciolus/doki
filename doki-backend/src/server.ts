import express, { type Express, type Request, type Response } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import GlobalErrorHandling from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";
import workspaceRouter from "./routes/workspace.route";
import boardRouter from "./routes/board.route";
import listRouter from "./routes/list.route";
import taskRouter from "./routes/task.route";
import { requestLogger } from "./middlewares/requestLogger.middleware";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { socketAuthenticate } from "./middlewares/socketAuth.middleware";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

export const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use(requestLogger);

io.use(socketAuthenticate);

io.on("connection", (socket) => {
  console.log(
    `Client connected: ${socket.id} (User ID: ${socket.data.user?.id})`,
  );

  socket.on("join_board", ({ boardId }: { boardId: string }) => {
    socket.join("board:" + boardId);
    console.log(`Socket ${socket.id} joined room board:${boardId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: "Dōki backend server is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/boards", boardRouter);
app.use("/api/lists", listRouter);
app.use("/api/tasks", taskRouter);

// Global Error Handling
app.use(GlobalErrorHandling);

httpServer.listen(port, () => {
  console.log(`Dōki server listening on port ${port}`);
});
