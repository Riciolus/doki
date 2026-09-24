import { AppError } from "../lib/error";
import { prisma } from "../lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../lib/token";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import bcrypt from "bcrypt";

export async function registerUser(data: RegisterInput) {
  const { name, password, email } = data;

  const isEmailExist = await prisma.user.findUnique({ where: { email } });
  if (isEmailExist) throw new AppError("Email already exists", 409);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  const accessToken = generateAccessToken({ userId: newUser.id, email });
  const refreshToken = generateRefreshToken({ userId: newUser.id });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: newUser.id,
      expiresAt,
    },
  });

  return { user: newUser, accessToken, refreshToken };
}

export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) throw new AppError("Invalid email or password", 401);

  const accessToken = generateAccessToken({ userId: user.id, email });
  const refreshToken = generateRefreshToken({ userId: user.id });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  await prisma.refreshToken.deleteMany({
    where: { userId: user.id, expiresAt: { lt: new Date() } },
  });

  const { password_hash, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
}

export async function refreshSession(refreshToken: string) {
  const { userId } = verifyRefreshToken(refreshToken);

  if (!userId) throw new AppError("Unauthorized", 401);

  const session = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
      userId,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!session) throw new AppError("Forbidden", 403);

  if (session.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    throw new AppError("Forbidden", 403);
  }
  const newAccessToken = generateAccessToken({
    userId,
    email: session.user.email,
  });

  return newAccessToken;
}
