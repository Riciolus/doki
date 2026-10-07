// src/types/index.ts

export type Role = "OWNER" | "EDITOR" | "VIEWER";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt?: string;
  user?: User;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: Role;
  joinedAt?: string;
  workspace?: Workspace;
  user?: User;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email?: string | null;
  token: string;
  role: Role;
  expiresAt: string;
  createdAt?: string;
  workspace?: Workspace;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt?: string;
  owner?: User;
  members?: WorkspaceMember[];
  boards?: Board[];
  invitations?: WorkspaceInvitation[];
}

export interface Board {
  id: string;
  workspaceId: string;
  title: string;
  createdAt?: string;
  workspace?: Workspace;
  lists?: List[];
  //description belom ada, belom di implement di server. future work
  // description?: string;
  activities?: ActivityLog[];
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  orderIndex: string; // String Fractional Indexing
  createdAt?: string;
  board?: Board;
  tasks?: Task[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt?: string;
  task?: Task;
  user?: User;
}

export interface Task {
  id: string; // UUID dibuat di client untuk Optimistic UI
  listId: string;
  createdById: string;
  title: string;
  description?: string | null;
  orderIndex: string; // String Fractional Indexing
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string | null;
  priority: Priority;
  assigneeId?: string | null;
  list?: List;
  creator?: User;
  assignee?: User | null;
  comments?: Comment[];
}

export interface ActivityLog {
  id: string;
  boardId: string;
  userId: string;
  action: string;
  detail: string;
  createdAt?: string;
  board?: Board;
  user?: User;
}
