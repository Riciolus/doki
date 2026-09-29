import z from "zod";

export const createCommentSchema = z.object({
  content: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Comment content is required"
          : "Comment content must be a string",
    })
    .min(1, "Comment content cannot be empty")
    .max(30, "Comment content must be 30 characters or less"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
