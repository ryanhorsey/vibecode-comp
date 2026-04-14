"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { TaskCategory, ColumnId } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface AddTaskFormProps {
  columnId: ColumnId;
  onAdd: (title: string, category: TaskCategory, description?: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("self-care");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), category, description.trim() || undefined);
    setTitle("");
    setDescription("");
    setCategory("self-care");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all text-sm font-medium group"
      >
        <Plus size={15} className="group-hover:rotate-90 transition-transform duration-200" />
        Add task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-blue-200 shadow-sm p-3 space-y-2"
    >
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you want to do?"
        className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent font-medium"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full text-xs text-gray-500 placeholder-gray-300 outline-none bg-transparent"
      />

      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all ${
                category === cat
                  ? `${cfg.bg} ${cfg.color} ring-1 ring-current`
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              {cfg.emoji} {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </form>
  );
}
