import { AppError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { CreateBoardInput, UpdateBoardInput } from "../schemas/board.schema";

export async function createBoard(
  workspaceId: string,
  payload: CreateBoardInput,
) {
  return await prisma.board.create({
    data: {
      workspaceId,
      title: payload.title,
    },
    include: {
      lists: true,
    },
  });
}

export async function getBoardById(boardId: string) {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },

    include: {
      lists: {
        orderBy: {
          orderIndex: "asc",
        },
        include: {
          tasks: {
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
      },
    },
  });

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  return board;
}

export async function updateBoard(boardId: string, payload: UpdateBoardInput) {
  return await prisma.board.update({
    where: {
      id: boardId,
    },
    data: payload,
  });
}

export async function deleteBoard(boardId: string) {
  return await prisma.board.delete({
    where: {
      id: boardId,
    },
  });
}
