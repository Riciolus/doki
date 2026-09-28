import { type NextFunction, type Request, type Response } from "express";
import { boardIdParamSchema } from "../schemas/board.schema";
import { createListSchema } from "../schemas/list.schema";
import { createList } from "../services/list.service";

export async function handleCreateList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { boardId } = boardIdParamSchema.parse(req.params);
    const payload = createListSchema.parse(req.body);

    const list = await createList(boardId, payload);

    res.status(201).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
  } catch (error) {
    next(error);
  }
}

export async function handleReorderList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
  } catch (error) {
    next(error);
  }
}
