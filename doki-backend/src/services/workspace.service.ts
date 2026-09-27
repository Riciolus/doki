import { prisma } from "../lib/prisma";

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
