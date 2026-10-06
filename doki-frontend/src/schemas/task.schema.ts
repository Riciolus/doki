import z from "zod";

export const createTaskSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),
  description: z.string().trim().optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters")
    .optional(),
  description: z.string().trim().nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
});

export const reorderTaskSchema = z.object({
  targetListId: z.string().uuid("Invalid target list ID format").optional(),
  prevTaskOrderIndex: z.string().nullable().optional(),
  nextTaskOrderIndex: z.string().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReorderTaskInput = z.infer<typeof reorderTaskSchema>;

export const taskIdParamSchema = z.object({
  taskId: z.string().uuid("Invalid task ID format"),
});
