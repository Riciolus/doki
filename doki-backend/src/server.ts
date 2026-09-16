import express, { type Express, type Request, type Response } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import GlobalErrorHandling from "./middleware/error.middleware";
import authRouter from "./routes/auth.route";
import { requestLogger } from "./middleware/requestLogger.middleware";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: "Dōki backend server is running",
  });
});

app.use("/api/auth", authRouter);

// Global Error Handling
app.use(GlobalErrorHandling);

app.listen(port, () => {
  console.log(`Dōki server listening on port ${port}`);
});
