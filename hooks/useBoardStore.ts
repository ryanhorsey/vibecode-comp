"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  ReactNode,
  createElement,
} from "react";
import { BoardState, BoardAction, Task, CheckIn, ColumnId } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";

const initialState: BoardState = {
  tasks: [],
  checkIns: [],
  streak: 0,
  lastActiveDate: null,
};

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "SET_STATE":
      return action.state;

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.task] };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)),
      };

    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };

    case "MOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.id) return t;
          return {
            ...t,
            column: action.column,
            order: action.order,
            completedAt:
              action.column === "done" ? new Date().toISOString() : t.completedAt,
          };
        }),
      };

    case "REORDER_TASKS":
      return { ...state, tasks: action.tasks };

    case "ADD_CHECK_IN":
      return { ...state, checkIns: [...state.checkIns, action.checkIn] };

    case "ACCEPT_SUGGESTION":
      return { ...state, tasks: [...state.tasks, action.task] };

    case "UPDATE_STREAK": {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (state.lastActiveDate === today) return state;
      const newStreak =
        state.lastActiveDate === yesterday ? state.streak + 1 : 1;
      return { ...state, streak: newStreak, lastActiveDate: today };
    }

    default:
      return state;
  }
}

interface BoardContextValue {
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
  addTask: (
    title: string,
    category: Task["category"],
    description?: string,
    column?: ColumnId
  ) => Task;
  moveTask: (id: string, column: ColumnId, order: number) => void;
  deleteTask: (id: string) => void;
  addCheckIn: (mood: CheckIn["mood"], notes?: string) => void;
  reorderTasks: (tasks: Task[]) => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOARD_STATE);
      if (saved) {
        dispatch({ type: "SET_STATE", state: JSON.parse(saved) });
      }
    } catch {
      // ignore read errors on first load
    }
    setHydrated(true);
    dispatch({ type: "UPDATE_STREAK" });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BOARD_STATE, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
  }, [state, hydrated]);

  const addTask = useCallback(
    (
      title: string,
      category: Task["category"],
      description?: string,
      column: ColumnId = "todo"
    ): Task => {
      const task: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        column,
        order: Date.now(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_TASK", task });
      return task;
    },
    []
  );

  const moveTask = useCallback((id: string, column: ColumnId, order: number) => {
    dispatch({ type: "MOVE_TASK", id, column, order });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "DELETE_TASK", id });
  }, []);

  const addCheckIn = useCallback((mood: CheckIn["mood"], notes?: string) => {
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      mood,
      notes,
    };
    dispatch({ type: "ADD_CHECK_IN", checkIn });
  }, []);

  const reorderTasks = useCallback((tasks: Task[]) => {
    dispatch({ type: "REORDER_TASKS", tasks });
  }, []);

  return createElement(
    BoardContext.Provider,
    {
      value: { state, dispatch, addTask, moveTask, deleteTask, addCheckIn, reorderTasks },
    },
    children
  );
}

export function useBoardStore(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoardStore must be used within BoardProvider");
  return ctx;
}
