import { Router } from "express";
import {
  handleCreateInvitation,
  handleCreateWorkspace,
  handleDeleteWorkspace,
  handleGetWorkspaceById,
  handleGetWorkspaceMembers,
  handleGetWorkspaces,
  handleJoinWorkspace,
  handleRemoveWorkspaceMember,
  handleUpdateMemberRole,
  handleUpdateWorkspace,
} from "../controllers/workspace.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeWorkspaceRole } from "../middlewares/rbac.middleware";
import { Role } from "../../generated/prisma/enums";
import { handleCreateBoard } from "../controllers/board.controller";

const router = Router();

router.use(authenticate);

router.post("/", handleCreateWorkspace);
router.get("/", handleGetWorkspaces);
router.get(
  "/:workspaceId",
  authorizeWorkspaceRole([Role.OWNER, Role.EDITOR, Role.VIEWER]),
  handleGetWorkspaceById,
);
router.patch(
  "/:workspaceId",
  authorizeWorkspaceRole([Role.OWNER]),
  handleUpdateWorkspace,
);
router.delete(
  "/:workspaceId",
  authorizeWorkspaceRole([Role.OWNER]),
  handleDeleteWorkspace,
);

router.post(
  "/:workspaceId/boards",
  authorizeWorkspaceRole([Role.OWNER, Role.EDITOR]),
  handleCreateBoard,
);

router.post(
  "/:workspaceId/invitations",
  authorizeWorkspaceRole([Role.OWNER, Role.EDITOR]),
  handleCreateInvitation,
);

router.post("/join", authenticate, handleJoinWorkspace);

router.get(
  "/:workspaceId/members",
  authorizeWorkspaceRole([Role.OWNER, Role.EDITOR, Role.VIEWER]),
  handleGetWorkspaceMembers,
);
router.patch(
  "/:workspaceId/members/:userId",
  authorizeWorkspaceRole([Role.OWNER]),
  handleUpdateMemberRole,
);
router.delete(
  "/:workspaceId/members/:userId",
  authorizeWorkspaceRole([Role.OWNER]),
  handleRemoveWorkspaceMember,
);

export default router;
