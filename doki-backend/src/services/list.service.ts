import { generateKeyBetween } from "fractional-indexing";
import { prisma } from "../lib/prisma";
import { CreateListInput } from "../schemas/list.schema";

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
