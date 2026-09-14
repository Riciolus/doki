import { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";

export default function GlobalErrorHandling(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      err: err.issues,
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
