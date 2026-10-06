import z from "zod";

export const createListSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "List title is required"
          : "List title must be a string",
    })
    .min(1, "List title cannot be empty")
    .max(100, "List title must be 100 characters or less"),
});

export const updateListSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "List title is required"
          : "List title must be a string",
    })
    .min(1, "List title cannot be empty")
    .max(100, "List title must be 100 characters or less"),
});

export const reorderListSchema = z.object({
  prevListOrderIndex: z.string().nullable(),
  nextListOrderIndex: z.string().nullable(),
});

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type ReorderListInput = z.infer<typeof reorderListSchema>;

export const listIdParamSchema = z.object({
  listId: z.string().uuid("Invalid list ID format"),
});
