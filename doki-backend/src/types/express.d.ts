import { AccessTokenPayload } from "../lib/token";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
