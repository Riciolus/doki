// src/mocks/data.ts
import type {
  Workspace,
  Board,
  List,
  Task,
  User,
  WorkspaceMember,
} from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Chen",
    email: "alex@acme.com",
  },
  {
    id: "user-2",
    name: "Jordan Lee",
    email: "jordan@acme.com",
  },
  {
    id: "user-3",
    name: "Sam Rivera",
    email: "sam@acme.com",
  },
];

export const mockWorkspaceMembers: WorkspaceMember[] = [
  {
    id: "wm-1",
    workspaceId: "ws-1",
    userId: "user-1",
    role: "OWNER",
    user: mockUsers[0],
  },
  {
    id: "wm-2",
    workspaceId: "ws-1",
    userId: "user-2",
    role: "EDITOR",
    user: mockUsers[1],
  },
  {
    id: "wm-3",
    workspaceId: "ws-1",
    userId: "user-3",
    role: "EDITOR",
    user: mockUsers[2],
  },
];

export const mockTasks: Task[] = [
  // To Do List Tasks
  {
    id: "task-1",
    listId: "list-todo",
    createdById: "user-1",
    title: "Design new landing page",
    description: "Create responsive design mockups in Figma",
    orderIndex: "a0",
    priority: "HIGH",
    assigneeId: "user-1",
    assignee: mockUsers[0],
    dueDate: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "task-2",
    listId: "list-todo",
    createdById: "user-2",
    title: "Set up database schema",
    description: "PostgreSQL migrations with Prisma",
    orderIndex: "a1",
    priority: "URGENT",
    assigneeId: "user-2",
    assignee: mockUsers[1],
    dueDate: "2026-10-10T00:00:00.000Z",
  },
  {
    id: "task-3",
    listId: "list-todo",
    createdById: "user-1",
    title: "Write API documentation",
    description: null,
    orderIndex: "a2",
    priority: "MEDIUM",
    assigneeId: null,
    assignee: null,
    dueDate: "2026-10-20T00:00:00.000Z",
  },

  // In Progress List Tasks
  {
    id: "task-4",
    listId: "list-inprogress",
    createdById: "user-1",
    title: "Implement authentication flow",
    description: "OAuth integration with GitHub and JWT refresh tokens",
    orderIndex: "a0",
    priority: "HIGH",
    assigneeId: "user-3",
    assignee: mockUsers[2],
    dueDate: "2026-10-12T00:00:00.000Z",
  },
  {
    id: "task-5",
    listId: "list-inprogress",
    createdById: "user-2",
    title: "Build dashboard UI components",
    description: null,
    orderIndex: "a1",
    priority: "HIGH",
    assigneeId: "user-1",
    assignee: mockUsers[0],
    dueDate: "2026-10-14T00:00:00.000Z",
  },

  // In Review List Tasks
  {
    id: "task-7",
    listId: "list-inreview",
    createdById: "user-2",
    title: "Payment integration",
    description: "Stripe checkout implementation",
    orderIndex: "a0",
    priority: "URGENT",
    assigneeId: "user-2",
    assignee: mockUsers[1],
    dueDate: "2026-10-11T00:00:00.000Z",
  },

  // Done List Tasks
  {
    id: "task-9",
    listId: "list-done",
    createdById: "user-1",
    title: "Setup monitoring and alerts",
    description: "Configured Sentry and DataDog",
    orderIndex: "a0",
    priority: "HIGH",
    assigneeId: "user-1",
    assignee: mockUsers[0],
    dueDate: "2026-10-05T00:00:00.000Z",
  },
];

export const mockLists: List[] = [
  {
    id: "list-todo",
    boardId: "board-1",
    title: "To Do",
    orderIndex: "a0",
    tasks: mockTasks.filter((t) => t.listId === "list-todo"),
  },
  {
    id: "list-inprogress",
    boardId: "board-1",
    title: "In Progress",
    orderIndex: "a1",
    tasks: mockTasks.filter((t) => t.listId === "list-inprogress"),
  },
  {
    id: "list-inreview",
    boardId: "board-1",
    title: "In Review",
    orderIndex: "a2",
    tasks: mockTasks.filter((t) => t.listId === "list-inreview"),
  },
  {
    id: "list-done",
    boardId: "board-1",
    title: "Done",
    orderIndex: "a3",
    tasks: mockTasks.filter((t) => t.listId === "list-done"),
  },
];

export const mockBoards: Board[] = [
  {
    id: "board-1",
    workspaceId: "ws-1",
    title: "Sprint Board Q3",
    lists: mockLists,
  },
  {
    id: "board-2",
    workspaceId: "ws-1",
    title: "Product Roadmap",
  },
  {
    id: "board-3",
    workspaceId: "ws-1",
    title: "Bug Triage",
  },
];

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Acme Corp",
    ownerId: "user-1",
    owner: mockUsers[0],
    members: mockWorkspaceMembers,
    boards: mockBoards,
  },
];
