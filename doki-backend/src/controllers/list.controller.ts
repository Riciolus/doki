import { type NextFunction, type Request, type Response } from "express";
import { boardIdParamSchema } from "../schemas/board.schema";
import {
  createListSchema,
  listIdParamSchema,
  reorderListSchema,
  updateListSchema,
} from "../schemas/list.schema";
import {
  createList,
  deleteList,
  reorderList,
  updateList,
} from "../services/list.service";

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
    const { listId } = listIdParamSchema.parse(req.params);
    const payload = updateListSchema.parse(req.body);

    const updatedList = await updateList(listId, payload);

    res.status(200).json({
      success: true,
      data: updatedList,
    });
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
    const { listId } = listIdParamSchema.parse(req.params);
    const payload = reorderListSchema.parse(req.body);

    const updatedList = await reorderList(listId, payload);

    res.status(200).json({
      success: true,
      data: updatedList,
    });
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
    const { listId } = listIdParamSchema.parse(req.params);

    await deleteList(listId);

    res.status(200).json({
      success: true,
      message: "List deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
