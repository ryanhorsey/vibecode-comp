export type ColumnId = "todo" | "in-progress" | "done";

export type TaskCategory =
  | "mindfulness"
  | "exercise"
  | "social"
  | "learning"
  | "self-care"
  | "custom";

export interface Task {
  id: string;
  title: string;
  description?: string;
  column: ColumnId;
  category: TaskCategory;
  createdAt: string;
  completedAt?: string;
  order: number;
  isSuggested?: boolean;
}

export interface CheckIn {
  id: string;
  timestamp: string;
  mood: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestedTasks?: SuggestedTask[];
}

export interface SuggestedTask {
  title: string;
  description?: string;
  category: TaskCategory;
}

export interface BoardState {
  tasks: Task[];
  checkIns: CheckIn[];
  streak: number;
  lastActiveDate: string | null;
}

export type BoardAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; task: Task }
  | { type: "DELETE_TASK"; id: string }
  | { type: "MOVE_TASK"; id: string; column: ColumnId; order: number }
  | { type: "REORDER_TASKS"; tasks: Task[] }
  | { type: "ADD_CHECK_IN"; checkIn: CheckIn }
  | { type: "SET_STATE"; state: BoardState }
  | { type: "ACCEPT_SUGGESTION"; task: Task }
  | { type: "UPDATE_STREAK" };
