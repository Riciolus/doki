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
import {
  handleCreateComment,
  handleGetComments,
} from "../controllers/comment.controller";

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
  "/:taskId/move",
  authorizeTaskRole([Role.OWNER, Role.EDITOR]),
  handleReorderTask,
);

router.delete(
  "/:taskId",
  authorizeTaskRole([Role.OWNER, Role.EDITOR]),
  handleDeleteTask,
);

// Comment
router.get(
  "/:taskId/comments",
  authorizeTaskRole([Role.OWNER, Role.EDITOR, Role.VIEWER]),
  handleGetComments,
);

router.post(
  "/:taskId/comments",
  authorizeTaskRole([Role.OWNER, Role.EDITOR, Role.VIEWER]),
  handleCreateComment,
);

export default router;
