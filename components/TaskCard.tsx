"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical } from "lucide-react";
import { Task } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

export function TaskCard({ task, index, onDelete, isNew }: TaskCardProps) {
  const cat = CATEGORY_CONFIG[task.category];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            group relative bg-white rounded-2xl p-3.5 shadow-sm border
            transition-all duration-200
            ${snapshot.isDragging ? "shadow-lg rotate-1 scale-105 border-blue-200" : "border-gray-100 hover:border-blue-100 hover:shadow-md"}
            ${isNew ? "animate-task-appear" : ""}
            ${task.column === "done" ? "opacity-75" : ""}
          `}
        >
          <div
            {...provided.dragHandleProps}
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={14} className="text-gray-400" />
          </div>

          <div className="pl-3">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm font-medium text-gray-800 leading-snug ${
                  task.column === "done" ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </p>
              <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"
                aria-label="Delete task"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {task.description && (
              <p className="mt-1 text-xs text-gray-400 leading-snug">{task.description}</p>
            )}

            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
