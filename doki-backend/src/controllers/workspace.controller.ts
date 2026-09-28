import { type NextFunction, type Request, type Response } from "express";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdParamSchema,
} from "../schemas/workspace.schema";
import { AccessTokenPayload } from "../lib/token";
import {
  createWorkspace,
  deleteWorkspace,
  getUserWorkspaceById,
  getUserWorkspaces,
  updateWorkspace,
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
    const workspaceId = req.params.workspaceId as string;

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
      message: "Successfully delete workspace",
    });
  } catch (error) {
    next(error);
  }
}
