import { ExtendedError, type Socket } from "socket.io";
import { verifyAccessToken } from "../lib/token";
const { parseCookie } = require("cookie");

export async function socketAuthenticate(
  socket: Socket,
  next: (err?: ExtendedError) => void,
) {
  try {
    const rawCookies = socket.request.headers.cookie || "";

    const cookies = parseCookie(rawCookies);
    const token = cookies.jwt_access;

    if (!token) {
      return next(new Error("Unauthorized: Missing jwt_access cookie"));
    }

    const decoded = verifyAccessToken(token);
    socket.data.user = { id: decoded.userId, email: decoded.email };

    next();
  } catch (error) {
    next(new Error("Unauthorized: Invalid or expired token"));
  }
}
