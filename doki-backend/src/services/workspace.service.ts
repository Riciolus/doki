import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import {
  CreateInvitationInput,
  UpdateWorkspaceInput,
} from "../schemas/workspace.schema";

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

export async function getUserWorkspaceByEmail(
  workspaceId: string,
  email: string,
) {
  return await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      user: {
        email,
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

export async function createInvitation(
  payload: CreateInvitationInput,
  workspaceId: string,
) {
  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return await prisma.workspaceInvitation.create({
    data: {
      email: payload.email,
      role: payload.role,
      workspaceId,
      expiresAt,
    },

    select: {
      id: true,
      token: true,
      email: true,
      role: true,
      expiresAt: true,
    },
  });
}

export async function getInvitationByToken(token: string) {
  return await prisma.workspaceInvitation.findUnique({
    where: {
      token,
    },
  });
}

export async function joinWorkspaceAndInvalidateToken(
  userId: string,
  workspaceId: string,
  role: Role,
  invitationId: string,
) {
  return await prisma.$transaction(async (tx) => {
    const newMember = await tx.workspaceMember.create({
      data: {
        userId,
        workspaceId,
        role,
      },
    });

    await tx.workspaceInvitation.delete({
      where: {
        id: invitationId,
      },
    });

    return newMember;
  });
}
