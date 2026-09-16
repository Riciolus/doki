import { NextFunction, type Request, type Response } from "express";
import { registerSchema } from "../schemas/auth.schema";
import { registerUser } from "../services/auth.service";
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
