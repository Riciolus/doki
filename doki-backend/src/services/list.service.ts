import { generateKeyBetween } from "fractional-indexing";
import { prisma } from "../lib/prisma";
import {
  CreateListInput,
  ReorderListInput,
  UpdateListInput,
} from "../schemas/list.schema";

export async function createList(boardId: string, payload: CreateListInput) {
  const lastList = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { orderIndex: "desc" },
  });

  const idx = generateKeyBetween(lastList?.orderIndex || null, null);

  return await prisma.list.create({
    data: {
      boardId,
      title: payload.title,
      orderIndex: idx,
    },
  });
}

export async function updateList(listId: string, payload: UpdateListInput) {
  return await prisma.list.update({
    where: { id: listId },
    data: payload,
  });
}

export async function reorderList(listId: string, payload: ReorderListInput) {
  const newOrderIndex = generateKeyBetween(
    payload.prevListOrderIndex,
    payload.nextListOrderIndex,
  );

  return await prisma.list.update({
    where: { id: listId },
    data: {
      orderIndex: newOrderIndex,
    },
  });
}

export async function deleteList(listId: string) {
  return await prisma.list.delete({
    where: { id: listId },
  });
}
