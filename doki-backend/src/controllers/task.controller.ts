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
import { io } from "../server";

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
    const { list, ...taskData } = newTask;

    io.to(`board:${list.boardId}`).emit("card_created", taskData);

    res.status(201).json({
      success: true,
      data: taskData,
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

    io.to(`board:${updatedTask.list.boardId}`).emit("card_moved", {
      taskId: updatedTask.id,
      targetListId: updatedTask.listId,
      newOrderIndex: updatedTask.orderIndex,
    });

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

    const { list } = await deleteTask(taskId);

    io.to(`board:${list.boardId}`).emit("card_deleted", {
      taskId,
      boardId: list.boardId,
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
