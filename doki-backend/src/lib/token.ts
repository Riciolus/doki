import jwt from "jsonwebtoken";
import z from "zod";
import { CookieOptions, type Response } from "express";

export const accessTokenPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
});
export const refreshTokenPayloadSchema = z.object({
  userId: z.string().uuid(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;

// Access Token (15 Minutes)
export function generateAccessToken(payload: AccessTokenPayload) {
  const secretKey = process.env.JWT_ACCESS_SECRET;
  if (!secretKey) throw new Error("JWT_ACCESS_SECRET is missing");

  return jwt.sign(payload, secretKey, { expiresIn: "15m" });
}

export function verifyAccessToken(token: string) {
  const secretKey = process.env.JWT_ACCESS_SECRET;
  if (!secretKey) throw new Error("JWT_ACCESS_SECRET is missing");

  const decoded = jwt.verify(token, secretKey);
  return accessTokenPayloadSchema.parse(decoded);
}

// Refresh Token (7 Day)
export function generateRefreshToken(payload: RefreshTokenPayload) {
  const secretKey = process.env.JWT_REFRESH_SECRET;
  if (!secretKey) throw new Error("JWT_REFRESH_SECRET is missing");

  return jwt.sign(payload, secretKey, { expiresIn: "7d" });
}

export function verifyRefreshToken(token: string) {
  const secretKey = process.env.JWT_REFRESH_SECRET;
  if (!secretKey) throw new Error("JWT_REFRESH_SECRET is missing");

  const decoded = jwt.verify(token, secretKey);
  return refreshTokenPayloadSchema.parse(decoded);
}

// Auth Cookies
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie("jwt_access", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("jwt_refresh", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });
}

export function setAccessTokenCookie(res: Response, accessToken: string) {
  res.cookie("jwt_access", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("jwt_access", cookieOptions);
  res.clearCookie("jwt_refresh", {
    ...cookieOptions,
    path: "/api/auth/refresh",
  });
}
