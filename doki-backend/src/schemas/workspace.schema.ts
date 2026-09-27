import z from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Workspace name is required"
          : "Workspace name must be a string",
    })
    .min(1, "Workspace name cannot be empty")
    .max(50, "Workspace name must be 50 characters or less"),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Workspace name is required"
          : "Workspace name must be a string",
    })
    .min(1, "Workspace name cannot be empty")
    .max(50, "Workspace name must be 50 characters or less"),
});

export const workspaceIdParamSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID format"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpadteWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
