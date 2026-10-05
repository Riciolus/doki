// src/types/index.ts

export type Role = "OWNER" | "EDITOR" | "VIEWER";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: Role;
  joinedAt?: string;
  user?: User;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt?: string;
  user?: User;
}

export interface Task {
  id: string;
  listId: string;
  createdById: string;
  title: string;
  description?: string | null;
  orderIndex: string; // Fractional Indexing
  priority: Priority;
  dueDate?: string | null;
  assigneeId?: string | null;
  assignee?: User | null;
  creator?: User;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  orderIndex: string; // Fractional Indexing
  createdAt?: string;
  tasks?: Task[];
}

export interface Board {
  id: string;
  workspaceId: string;
  title: string;
  createdAt?: string;
  lists?: List[];
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt?: string;
  owner?: User;
  members?: WorkspaceMember[];
  boards?: Board[];
}
