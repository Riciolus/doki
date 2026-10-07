import { type Request, type Response, type NextFunction } from "express";
import { AccessTokenPayload, verifyAccessToken } from "../lib/token";
import { AppError } from "../lib/error";

export interface AuthenticatedRequest extends Request {
  user: AccessTokenPayload;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.jwt_access;

    if (!accessToken) throw new AppError("Unauthorized", 401);

    const verified = verifyAccessToken(accessToken);

    req.user = verified;

    next();
  } catch (error: any) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw new AppError("Unauthorized", 401);
    }
    next(error);
  }
}
