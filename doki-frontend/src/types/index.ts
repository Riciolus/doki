export interface Task {
  id: string;
  title: string;
  snippet?: string;
  status: "todo" | "inprogress" | "inreview" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate?: string;
  comments: number;
  tags?: string[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
}

export interface Workspace {
  id: string;
  name: string;
  boards: Board[];
}
