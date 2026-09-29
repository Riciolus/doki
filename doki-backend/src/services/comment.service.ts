import { prisma } from "../lib/prisma";
import { CreateCommentInput } from "../schemas/comment.schema";

export async function getComments(taskId: string) {
  return await prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function createComment(
  userId: string,
  taskId: string,
  payload: CreateCommentInput,
) {
  return await prisma.comment.create({ data: { userId, taskId, ...payload } });
}
