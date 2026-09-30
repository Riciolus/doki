import {
  CreateTaskInput,
  ReorderTaskInput,
  UpdateTaskInput,
} from "../schemas/task.schema";
import { prisma } from "../lib/prisma";
import { generateKeyBetween } from "fractional-indexing";
import { AppError } from "../lib/error";

export async function createTask(
  listId: string,
  userId: string,
  payload: CreateTaskInput,
) {
  const lastTask = await prisma.task.findFirst({
    where: { listId },
    orderBy: { orderIndex: "desc" },
  });

  const idx = generateKeyBetween(lastTask?.orderIndex || null, null);

  return await prisma.task.create({
    data: { ...payload, orderIndex: idx, createdById: userId, listId },
    include: {
      list: {
        select: {
          boardId: true,
        },
      },
    },
  });
}

export async function getTask(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

export async function updateTask(taskId: string, payload: UpdateTaskInput) {
  return await prisma.task.update({
    where: { id: taskId },
    data: payload,
  });
}

export async function reorderTask(taskId: string, payload: ReorderTaskInput) {
  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

  if (!existingTask) {
    throw new AppError("Task not found", 404);
  }

  const newOrderIndex = generateKeyBetween(
    payload.prevTaskOrderIndex,
    payload.nextTaskOrderIndex,
  );

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      listId: payload.targetListId ?? existingTask.listId,
      orderIndex: newOrderIndex,
    },
    include: {
      list: {
        select: {
          boardId: true,
        },
      },
    },
  });
}

export async function deleteTask(taskId: string) {
  return await prisma.task.delete({
    where: { id: taskId },
    select: { list: { select: { boardId: true } } },
  });
}
