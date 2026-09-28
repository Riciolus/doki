import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../lib/error";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { AccessTokenPayload } from "../lib/token";
import { workspaceIdParamSchema } from "../schemas/workspace.schema";
import { boardIdParamSchema } from "../schemas/board.schema";

export function authorizeWorkspaceRole(allowedRoles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user as AccessTokenPayload;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const { workspaceId } = workspaceIdParamSchema.parse(req.params);

      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
      });

      if (!workspace) {
        throw new AppError("Workspace not found", 404);
      }

      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId: userId,
        },
      });

      if (!member) {
        throw new AppError("You are not a member of this workspace", 403);
      }

      if (!allowedRoles.includes(member.role)) {
        throw new AppError(
          "You do not have permission to perform this action",
          403,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function authorizeBoardRole(allowedRoles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user as AccessTokenPayload;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const { boardId } = boardIdParamSchema.parse(req.params);

      if (!boardId) {
        throw new AppError("Board ID is required", 400);
      }

      const board = await prisma.board.findUnique({
        where: {
          id: boardId,
        },
      });

      if (!board) {
        throw new AppError("Board not found", 404);
      }

      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: board.workspaceId,
          userId: userId,
        },
      });

      if (!member) {
        throw new AppError("You are not a member of this workspace", 403);
      }

      if (!allowedRoles.includes(member.role)) {
        throw new AppError(
          "You do not have permission to perform this action",
          403,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
