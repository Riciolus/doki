import type { Task, Board, Workspace, User } from "@/types";

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Acme Corp",
    boards: [
      { id: "board-1", title: "Sprint Board Q3", description: "Q3 planning" },
      {
        id: "board-2",
        title: "Product Roadmap",
        description: "Product planning",
      },
      { id: "board-3", title: "Bug Triage", description: "Bug tracking" },
    ],
  },
];

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Chen",
    avatar: "AC",
    role: "owner",
  },
  {
    id: "user-2",
    name: "Jordan Lee",
    avatar: "JL",
    role: "editor",
  },
  {
    id: "user-3",
    name: "Sam Rivera",
    avatar: "SR",
    role: "editor",
  },
];

export const mockTasks: Task[] = [
  // To Do
  {
    id: "task-1",
    title: "Design new landing page",
    snippet: "Create responsive design mockups",
    status: "todo",
    priority: "high",
    assignee: mockUsers[0],
    dueDate: "2025-10-15",
    comments: 3,
    tags: ["design"],
  },
  {
    id: "task-2",
    title: "Set up database schema",
    snippet: "PostgreSQL migrations",
    status: "todo",
    priority: "urgent",
    assignee: mockUsers[1],
    dueDate: "2025-10-10",
    comments: 5,
    tags: ["backend"],
  },
  {
    id: "task-3",
    title: "Write API documentation",
    status: "todo",
    priority: "medium",
    dueDate: "2025-10-20",
    comments: 0,
    tags: ["documentation"],
  },

  // In Progress
  {
    id: "task-4",
    title: "Implement authentication flow",
    snippet: "OAuth integration with GitHub",
    status: "inprogress",
    priority: "high",
    assignee: mockUsers[2],
    dueDate: "2025-10-12",
    comments: 8,
    tags: ["backend", "security"],
  },
  {
    id: "task-5",
    title: "Build dashboard UI components",
    status: "inprogress",
    priority: "high",
    assignee: mockUsers[0],
    dueDate: "2025-10-14",
    comments: 2,
    tags: ["frontend"],
  },
  {
    id: "task-6",
    title: "Performance optimization",
    snippet: "Reduce bundle size by 20%",
    status: "inprogress",
    priority: "medium",
    comments: 4,
  },

  // In Review
  {
    id: "task-7",
    title: "Payment integration",
    snippet: "Stripe checkout implementation",
    status: "inreview",
    priority: "urgent",
    assignee: mockUsers[1],
    dueDate: "2025-10-11",
    comments: 12,
    tags: ["payments"],
  },
  {
    id: "task-8",
    title: "Email notification system",
    status: "inreview",
    priority: "medium",
    assignee: mockUsers[2],
    comments: 6,
    tags: ["backend"],
  },

  // Done
  {
    id: "task-9",
    title: "Setup monitoring and alerts",
    snippet: "Configured Sentry and DataDog",
    status: "done",
    priority: "high",
    assignee: mockUsers[0],
    dueDate: "2025-10-05",
    comments: 1,
    tags: ["devops"],
  },
  {
    id: "task-10",
    title: "Migrate to TypeScript",
    status: "done",
    priority: "medium",
    comments: 7,
    tags: ["refactor"],
  },
];

export const mockActiveUsers = [mockUsers[0], mockUsers[1], mockUsers[2]];
