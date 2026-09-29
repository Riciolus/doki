import { Router } from "express";
import { authorizeTaskRole } from "../middlewares/rbac.middleware";
import { Role } from "../../generated/prisma/enums";
import {
  handleDeleteTask,
  handleGetTask,
  handleReorderTask,
  handleUpdateTask,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/:taskId",
  authorizeTaskRole([Role.OWNER, Role.EDITOR, Role.VIEWER]),
  handleGetTask,
);

router.patch(
  "/:taskId",
  authorizeTaskRole([Role.OWNER, Role.EDITOR]),
  handleUpdateTask,
);

router.patch(
  "/:taskId/reorder",
  authorizeTaskRole([Role.OWNER, Role.EDITOR]),
  handleReorderTask,
);

router.delete(
  "/:taskId",
  authorizeTaskRole([Role.OWNER, Role.EDITOR]),
  handleDeleteTask,
);

export default router;
