"use client";

import { useState, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useBoardStore } from "@/hooks/useBoardStore";
import { Column } from "./Column";
import { COLUMNS } from "@/lib/constants";
import { ColumnId, SuggestedTask, Task, TaskCategory } from "@/lib/types";

interface KanbanBoardProps {
  suggestions: SuggestedTask[];
  onAcceptSuggestion: (suggestion: SuggestedTask) => void;
  onDismissSuggestion: (suggestion: SuggestedTask) => void;
  onTaskCompleted?: (task: Task) => void;
}

export function KanbanBoard({
  suggestions,
  onAcceptSuggestion,
  onDismissSuggestion,
  onTaskCompleted,
}: KanbanBoardProps) {
  const { state, addTask, moveTask, deleteTask, reorderTasks } = useBoardStore();
  const [newlyCompletedId, setNewlyCompletedId] = useState<string | null>(null);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index)
        return;

      const destColumn = destination.droppableId as ColumnId;
      const sourceColumn = source.droppableId as ColumnId;

      if (sourceColumn === destColumn) {
        // Reorder within same column
        const columnTasks = [...state.tasks]
          .filter((t) => t.column === destColumn)
          .sort((a, b) => a.order - b.order);

        const [moved] = columnTasks.splice(source.index, 1);
        columnTasks.splice(destination.index, 0, moved);

        const reordered = columnTasks.map((t, i) => ({ ...t, order: i * 1000 }));
        const otherTasks = state.tasks.filter((t) => t.column !== destColumn);
        reorderTasks([...otherTasks, ...reordered]);
      } else {
        // Move to different column
        const destTasks = state.tasks
          .filter((t) => t.column === destColumn)
          .sort((a, b) => a.order - b.order);

        const newOrder = destination.index * 1000 + 500;

        const movedTask = state.tasks.find((t) => t.id === draggableId);
        if (movedTask && destColumn === "done" && sourceColumn !== "done") {
          setNewlyCompletedId(draggableId);
          onTaskCompleted?.(movedTask);
          setTimeout(() => setNewlyCompletedId(null), 2000);
        }

        moveTask(draggableId, destColumn, newOrder);
      }
    },
    [state.tasks, moveTask, reorderTasks, onTaskCompleted]
  );

  const handleAddTask = useCallback(
    (columnId: ColumnId) =>
      (title: string, category: TaskCategory, description?: string) => {
        addTask(title, category, description, columnId);
      },
    [addTask]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            columnId={col.id}
            tasks={state.tasks.filter((t) => t.column === col.id)}
            suggestions={col.id === "todo" ? suggestions : []}
            onDelete={deleteTask}
            onAddTask={handleAddTask(col.id)}
            onAcceptSuggestion={onAcceptSuggestion}
            onDismissSuggestion={onDismissSuggestion}
            newlyCompletedId={newlyCompletedId}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
