import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { ZodError } from "zod";

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

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: "Dōki backend server is running",
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: false,
      message: "Validation Error",
      err: err.message,
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Resource with unique field already exists",
    });
  }

  // Tangani data tidak ditemukan pada Prisma
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  return res.status(500).json({
    status: false,
    message: "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Dōki server listening on port ${port}`);
});
