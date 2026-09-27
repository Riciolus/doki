import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../lib/error";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { AccessTokenPayload } from "../lib/token";

export function authorizeWorkspaceRole(allowedRoles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user as AccessTokenPayload;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const workspaceId = req.params.workspaceId as string;

      if (!workspaceId) {
        throw new AppError("Workspace ID is required", 400);
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

      const boardId = req.params.boardId as string;

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
