import { type NextFunction, type Request, type Response } from "express";
import {
  boardIdParamSchema,
  createBoardSchema,
  updateBoardSchema,
} from "../schemas/board.schema";
import {
  createBoard,
  deleteBoard,
  getBoardById,
  getWorkspaceBoards,
  updateBoard,
} from "../services/board.service";
import { workspaceIdParamSchema } from "../schemas/workspace.schema";

export async function handleCreateBoard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdParamSchema.parse(req.params);
    const payload = createBoardSchema.parse(req.body);

    const newBoard = await createBoard(workspaceId, payload);

    res.status(201).json({
      success: true,
      data: newBoard,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetWorkspaceBoards(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdParamSchema.parse(req.params);

    const boards = await getWorkspaceBoards(workspaceId);

    res.json({
      success: true,
      data: boards,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetBoardById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { boardId } = boardIdParamSchema.parse(req.params);

    const board = await getBoardById(boardId);

    res.json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateBoard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { boardId } = boardIdParamSchema.parse(req.params);
    const payload = updateBoardSchema.parse(req.body);

    const updatedBoard = await updateBoard(boardId, payload);

    res.json({
      success: true,
      data: updatedBoard,
    });
  } catch (error) {
    next(error);
  }
}
export async function handleDeleteBoard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { boardId } = boardIdParamSchema.parse(req.params);

    await deleteBoard(boardId);

    res.json({
      success: true,
      message: "Successfully deleted board",
    });
  } catch (error) {
    next(error);
  }
}
