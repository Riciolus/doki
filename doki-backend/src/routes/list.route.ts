import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeListRole } from "../middlewares/rbac.middleware";
import { Role } from "../../generated/prisma/enums";
import {
  handleDeleteList,
  handleReorderList,
  handleUpdateList,
} from "../controllers/list.controller";
import { handleCreateTask } from "../controllers/task.controller";

const router = Router();

router.use(authenticate);

router.patch(
  "/:listId",
  authorizeListRole([Role.OWNER, Role.EDITOR]),
  handleUpdateList,
);
router.patch(
  "/:listId/move",
  authorizeListRole([Role.OWNER, Role.EDITOR]),
  handleReorderList,
);
router.delete(
  "/:listId",
  authorizeListRole([Role.OWNER, Role.EDITOR]),
  handleDeleteList,
);

router.post(
  "/:listId/tasks",
  authorizeListRole([Role.OWNER, Role.EDITOR]),
  handleCreateTask,
);

export default router;
