import { type NextFunction, type Request, type Response } from "express";
import { listIdParamSchema } from "../schemas/list.schema";
import {
  createTask,
  deleteTask,
  getTask,
  reorderTask,
  updateTask,
} from "../services/task.service";
import {
  createTaskSchema,
  reorderTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../schemas/task.schema";
import { AccessTokenPayload } from "../lib/token";

export async function handleCreateTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.user as AccessTokenPayload;
    const { listId } = listIdParamSchema.parse(req.params);
    const payload = createTaskSchema.parse(req.body);

    const newTask = await createTask(listId, userId, payload);

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { taskId } = taskIdParamSchema.parse(req.params);

    const task = await getTask(taskId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { taskId } = taskIdParamSchema.parse(req.params);
    const payload = updateTaskSchema.parse(req.body);

    const updatedTask = await updateTask(taskId, payload);

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleReorderTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { taskId } = taskIdParamSchema.parse(req.params);
    const payload = reorderTaskSchema.parse(req.body);

    const updatedTask = await reorderTask(taskId, payload);

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { taskId } = taskIdParamSchema.parse(req.params);

    await deleteTask(taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
