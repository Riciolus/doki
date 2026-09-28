import { type NextFunction, type Request, type Response } from "express";
import {
  createInvitationSchema,
  createWorkspaceSchema,
  joinWorkspaceSchema,
  updateMemberRoleSchema,
  updateWorkspaceSchema,
  workspaceIdParamSchema,
  workspaceMemberParamSchema,
} from "../schemas/workspace.schema";
import { AccessTokenPayload } from "../lib/token";
import {
  createInvitation,
  createWorkspace,
  deleteWorkspace,
  getInvitationByToken,
  getUserWorkspaceByEmail,
  getUserWorkspaceById,
  getUserWorkspaces,
  getWorkspaceMembers,
  joinWorkspaceAndInvalidateToken,
  removeWorkspaceMember,
  updateWorkspace,
  updateWorkspaceMemberRole,
} from "../services/workspace.service";
import { AppError } from "../lib/error";

export async function handleCreateWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = createWorkspaceSchema.parse(req.body);
    const { userId } = req.user as AccessTokenPayload;

    const createdWorkspace = await createWorkspace(name, userId);

    res.status(201).json({
      success: true,
      data: createdWorkspace,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetWorkspaces(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.user as AccessTokenPayload;

    const workspaces = await getUserWorkspaces(userId);

    res.json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetWorkspaceById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdParamSchema.parse(req.params);

    if (!workspaceId) {
      throw new AppError("Workspace ID is required", 400);
    }

    const workspace = await getUserWorkspaceById(workspaceId);

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    res.json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdParamSchema.parse(req.params);
    const payload = updateWorkspaceSchema.parse(req.body);

    const updatedData = await updateWorkspace(payload, workspaceId);
    res.status(200).json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdParamSchema.parse(req.params);

    await deleteWorkspace(workspaceId);

    res.status(200).json({
      success: true,
      message: "Successfully deleted workspace",
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCreateInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = createInvitationSchema.parse(req.body);
    const { workspaceId } = workspaceIdParamSchema.parse(req.params);

    if (payload.email) {
      const existingUser = await getUserWorkspaceByEmail(
        workspaceId,
        payload.email,
      );

      if (existingUser) {
        throw new AppError(
          "User with this email is already a member of this workspace",
          400,
        );
      }
    }

    const invitation = await createInvitation(payload, workspaceId);

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleJoinWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = joinWorkspaceSchema.parse(req.body);
    const { userId, email } = req.user as AccessTokenPayload;

    const invitation = await getInvitationByToken(token);

    if (!invitation) {
      throw new AppError("Invitation not found", 404);
    }

    if (invitation.email && invitation.email !== email) {
      throw new AppError("Unauthorized", 403);
    }

    if (invitation.expiresAt < new Date()) {
      throw new AppError("Invitation expired", 400);
    }

    const isMember = await getUserWorkspaceByEmail(
      invitation.workspaceId,
      email,
    );

    if (isMember) {
      throw new AppError("You are already a member of this workspace", 400);
    }

    const newMember = await joinWorkspaceAndInvalidateToken(
      userId,
      invitation.workspaceId,
      invitation.role,
      invitation.id,
    );

    res.status(200).json({
      success: true,
      message: "Successfully joined the workspace",
      data: newMember,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetWorkspaceMembers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdParamSchema.parse(req.params);
    const members = await getWorkspaceMembers(workspaceId);

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateMemberRole(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId, userId } = workspaceMemberParamSchema.parse(
      req.params,
    );
    const payload = updateMemberRoleSchema.parse(req.body);

    const currentUser = req.user as AccessTokenPayload;

    if (currentUser.userId === userId && payload.role !== "OWNER") {
      throw new AppError("You cannot downgrade your own role", 400);
    }
    const updatedMemberRole = await updateWorkspaceMemberRole(
      workspaceId,
      userId,
      payload,
    );

    res.json({
      success: true,
      data: updatedMemberRole,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleRemoveWorkspaceMember(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId, userId } = workspaceMemberParamSchema.parse(
      req.params,
    );
    const currentUser = req.user as AccessTokenPayload;

    if (currentUser.userId === userId) {
      throw new AppError("Use leave workspace endpoint instead of kick", 400);
    }

    await removeWorkspaceMember(workspaceId, userId);

    res.json({
      success: true,
      message: "Successfully removed member",
    });
  } catch (error) {
    next(error);
  }
}
