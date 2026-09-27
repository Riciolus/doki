import { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/error";

export default function GlobalErrorHandling(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isProd = process.env.NODE_ENV === "production";
  const errName = err.name || "Error";
  const errMsg = err.message || "Unknown error occurred";

  // Format satu baris clean
  console.error(
    `\x1b[31m[ERROR]\x1b[0m ${req.method} ${req.originalUrl} -> ${errName}: ${errMsg}`,
  );

  // Stack trace hanya ditampilkan saat dev dan dipangkas tipis
  if (!isProd && err.stack) {
    const stackSnippet = err.stack
      .split("\n")
      .slice(1, 3)
      .map((line: string) => `        ${line.trim()}`)
      .join("\n");
    console.error(`\x1b[90m${stackSnippet}\x1b[0m`);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      err: err.issues,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma Code Error
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Resource with unique field already exists",
    });
  }

  // Prisma Code Error
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
