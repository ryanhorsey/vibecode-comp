"use client";

import { Check, X } from "lucide-react";
import { SuggestedTask as SuggestedTaskType } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface SuggestedTaskProps {
  suggestion: SuggestedTaskType;
  onAccept: () => void;
  onDismiss: () => void;
}

export function SuggestedTask({ suggestion, onAccept, onDismiss }: SuggestedTaskProps) {
  const cat = CATEGORY_CONFIG[suggestion.category];

  return (
    <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-3.5 border-2 border-dashed border-blue-200 group animate-task-appear">
      <div className="absolute -top-1.5 -right-1.5 flex gap-1">
        <button
          onClick={onAccept}
          className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
          title="Add to board"
        >
          <Check size={11} />
        </button>
        <button
          onClick={onDismiss}
          className="w-6 h-6 bg-gray-300 hover:bg-gray-400 text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
          title="Dismiss"
        >
          <X size={11} />
        </button>
      </div>

      <div className="flex items-start gap-2 mb-1">
        <span className="text-base">{cat.emoji}</span>
        <p className="text-sm font-medium text-gray-700 leading-snug">{suggestion.title}</p>
      </div>
      {suggestion.description && (
        <p className="text-xs text-gray-400 ml-7">{suggestion.description}</p>
      )}
      <span
        className={`mt-2 ml-7 inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}
      >
        Suggested by CareBot
      </span>
    </div>
  );
}
