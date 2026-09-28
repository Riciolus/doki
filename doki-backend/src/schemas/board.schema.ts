import { z } from "zod";

export const createBoardSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Board title is required"
          : "Board title must be a string",
    })
    .min(1, "Board title cannot be empty")
    .max(100, "Board title must be 100 characters or less"),
});

export const updateBoardSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Board title is required"
          : "Board title must be a string",
    })
    .min(1, "Board title cannot be empty")
    .max(100, "Board title must be 100 characters or less"),
});

export const boardIdParamSchema = z.object({
  boardId: z.string().uuid("Invalid board ID format"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
