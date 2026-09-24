import { Router } from "express";
import {
  handleLogin,
  handleRefreshSession,
  handleRegister,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/refresh", handleRefreshSession);

export default router;
