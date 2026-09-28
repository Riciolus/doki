import { prisma } from "../lib/prisma";
import { UpdateWorkspaceInput } from "../schemas/workspace.schema";

export async function createWorkspace(name: string, ownerId: string) {
  return await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name,
        ownerId,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: ownerId,
        role: "OWNER",
      },
    });

    return workspace;
  });
}

export async function getUserWorkspaces(userId: string) {
  const members = await prisma.workspaceMember.findMany({
    where: {
      userId,
    },

    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          ownerId: true,
          createdAt: true,
        },
      },
    },
  });

  return members.map((member) => ({
    id: member.workspace.id,
    name: member.workspace.name,
    owner: member.workspace.ownerId,
    role: member.role,
    joinedAt: member.joinedAt,
  }));
}

export async function getUserWorkspaceById(workspaceId: string) {
  return await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },

    include: {
      boards: {
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      },

      members: {
        select: {
          userId: true,
          role: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function updateWorkspace(
  payload: UpdateWorkspaceInput,
  workspaceId: string,
) {
  return await prisma.workspace.update({
    where: {
      id: workspaceId,
    },

    data: payload,
  });
}

export async function deleteWorkspace(workspaceId: string) {
  return await prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
}
