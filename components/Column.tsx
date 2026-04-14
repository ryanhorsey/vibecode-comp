"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Task, ColumnId, SuggestedTask as SuggestedTaskType, TaskCategory } from "@/lib/types";
import { COLUMNS } from "@/lib/constants";
import { TaskCard } from "./TaskCard";
import { AddTaskForm } from "./AddTaskForm";
import { SuggestedTask } from "./SuggestedTask";

interface ColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  suggestions: SuggestedTaskType[];
  onDelete: (id: string) => void;
  onAddTask: (title: string, category: TaskCategory, description?: string) => void;
  onAcceptSuggestion: (suggestion: SuggestedTaskType) => void;
  onDismissSuggestion: (suggestion: SuggestedTaskType) => void;
  newlyCompletedId?: string | null;
}

export function Column({
  columnId,
  tasks,
  suggestions,
  onDelete,
  onAddTask,
  onAcceptSuggestion,
  onDismissSuggestion,
  newlyCompletedId,
}: ColumnProps) {
  const col = COLUMNS.find((c) => c.id === columnId)!;
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const columnColors: Record<ColumnId, string> = {
    todo: "from-slate-50 to-slate-50 border-slate-200",
    "in-progress": "from-blue-50 to-sky-50 border-blue-100",
    done: "from-green-50 to-emerald-50 border-green-100",
  };

  const headerColors: Record<ColumnId, string> = {
    todo: "text-slate-600",
    "in-progress": "text-blue-600",
    done: "text-green-600",
  };

  return (
    <div
      className={`flex flex-col rounded-3xl bg-gradient-to-b ${columnColors[columnId]} border p-3 min-h-[400px]`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-base">{col.emoji}</span>
          <h2 className={`font-semibold text-sm ${headerColors[columnId]}`}>{col.label}</h2>
        </div>
        <span className="text-xs font-medium bg-white/70 text-gray-500 px-2 py-0.5 rounded-full shadow-inner">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 min-h-[80px] rounded-2xl transition-colors duration-150 p-1
              ${snapshot.isDraggingOver ? "bg-blue-100/50" : ""}
            `}
          >
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={onDelete}
                isNew={task.id === newlyCompletedId}
              />
            ))}
            {provided.placeholder}

            {suggestions.length > 0 && columnId === "todo" && (
              <div className="space-y-2 mt-2 pt-2 border-t border-blue-100">
                {suggestions.map((s, i) => (
                  <SuggestedTask
                    key={i}
                    suggestion={s}
                    onAccept={() => onAcceptSuggestion(s)}
                    onDismiss={() => onDismissSuggestion(s)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Droppable>

      <div className="mt-2">
        <AddTaskForm columnId={columnId} onAdd={onAddTask} />
      </div>
    </div>
  );
}
