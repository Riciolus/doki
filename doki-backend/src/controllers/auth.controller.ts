import { NextFunction, type Request, type Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { loginUser, registerUser } from "../services/auth.service";
import { setAuthCookies } from "../lib/token";

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
