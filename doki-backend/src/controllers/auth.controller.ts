import { NextFunction, type Request, type Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import {
  getUserDetail,
  loginUser,
  refreshSession,
  registerUser,
} from "../services/auth.service";
import {
  AccessTokenPayload,
  clearAuthCookies,
  setAccessTokenCookie,
  setAuthCookies,
} from "../lib/token";
import { AppError } from "../lib/error";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = registerSchema.parse(req.body);
    const userData = await registerUser(data);

    setAuthCookies(res, userData.accessToken, userData.refreshToken);

    res.status(201).json({
      success: true,
      data: userData.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = loginSchema.parse(req.body);
    const userData = await loginUser(data);

    setAuthCookies(res, userData.accessToken, userData.refreshToken);

    res.status(200).json({
      success: true,
      data: userData.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleRefreshSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies.jwt_refresh;
    if (!refreshToken) throw new AppError("Unauthorized", 401);

    const accessToken = await refreshSession(refreshToken);

    setAccessTokenCookie(res, accessToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogout(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetMe(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, email } = req.user as AccessTokenPayload;

    const data = await getUserDetail(userId, email);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
