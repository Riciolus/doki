import { Router } from "express";
import {
  handleDeleteBoard,
  handleGetBoardById,
  handleUpdateBoard,
} from "../controllers/board.controller";
import { Role } from "../../generated/prisma/enums";
import { authorizeBoardRole } from "../middlewares/rbac.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/:boardId",
  authorizeBoardRole([Role.OWNER, Role.EDITOR, Role.VIEWER]),
  handleGetBoardById,
);
router.patch(
  "/:boardId",
  authorizeBoardRole([Role.OWNER, Role.EDITOR]),
  handleUpdateBoard,
);
router.delete(
  "/:boardId",
  authorizeBoardRole([Role.OWNER, Role.EDITOR]),
  handleDeleteBoard,
);

export default router;
