import { type NextFunction, type Request, type Response } from "express";
import { createWorkspaceSchema } from "../schemas/workspace.schema";
import { AccessTokenPayload } from "../lib/token";
import {
  createWorkspace,
  getUserWorkspaces,
} from "../services/workspace.service";

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
      status: true,
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
}
