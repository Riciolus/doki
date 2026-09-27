import { Router } from "express";
import {
  handleCreateWorkspace,
  handleGetWorkspaces,
} from "../controllers/workspace.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", handleCreateWorkspace);
router.get("/", handleGetWorkspaces);

export default router;
