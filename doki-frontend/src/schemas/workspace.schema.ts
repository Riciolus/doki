import z from "zod";

// WORKSPACE VALIDATION
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
export type WorkspaceIdInput = z.infer<typeof workspaceIdParamSchema>;

// CREATE INVITATION AND JOIN INVITATION VALIDATION
export const createInvitationSchema = z.object({
  email: z.string().email("Invalid email format").optional(), // Opsional!
  role: z.enum(["OWNER", "EDITOR", "VIEWER"]).default("VIEWER"),
});

export const joinWorkspaceSchema = z.object({
  token: z.string().uuid("Invalid invitation token format"),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type JoinWorkspaceInput = z.infer<typeof joinWorkspaceSchema>;

// MEMBER MANAGEMENT VALIDATION

export const workspaceMemberParamSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  userId: z.string().uuid("Invalid user ID"),
});

// export const updateMemberRoleSchema = z.object({
//   role: z.enum(Role, {
//     error: (issue) =>
//       issue.input === undefined ? "Role is required" : "Role must be a enum",
//   }),
// });

export type WorkspaceMemberParamInput = z.infer<
  typeof workspaceMemberParamSchema
>;
// export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
