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
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

export const createInvitationSchema = z.object({
  email: z.string().email("Invalid email format").optional(), // Opsional!
  role: z.enum(["OWNER", "EDITOR", "VIEWER"]).default("VIEWER"),
});

export const joinWorkspaceSchema = z.object({
  token: z.string().uuid("Invalid invitation token format"),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type JoinWorkspaceInput = z.infer<typeof joinWorkspaceSchema>;
