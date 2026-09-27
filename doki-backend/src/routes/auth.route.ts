import { Router } from "express";
import {
  handleGetMe,
  handleLogin,
  handleLogout,
  handleRefreshSession,
  handleRegister,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/refresh", handleRefreshSession);
router.post("/logout", handleLogout);
router.get("/me", authenticate, handleGetMe);

export default router;
