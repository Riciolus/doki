import { type Request, type Response, type NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationInMs = (Number(end - start) / 1e6).toFixed(2);
    const status = res.statusCode;

    // Kode warna ANSI
    const color =
      status >= 500
        ? "\x1b[31m" // Merah
        : status >= 400
          ? "\x1b[33m" // Kuning
          : "\x1b[32m"; // Hijau
    const reset = "\x1b[0m";

    console.log(
      `[HTTP] ${req.method.padEnd(6)} ${req.originalUrl} -> ${color}${status}${reset} (${durationInMs}ms)`,
    );
  });

  next();
}
