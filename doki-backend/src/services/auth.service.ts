import { AppError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../lib/token";
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

  const { password_hash, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
}
