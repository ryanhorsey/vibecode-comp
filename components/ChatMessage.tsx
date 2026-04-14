"use client";

import { ChatMessage as ChatMessageType, SuggestedTask } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { Plus } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  onAddSuggestion?: (suggestion: SuggestedTask) => void;
}

export function ChatMessageBubble({ message, onAddSuggestion }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-1 text-sm">
          🤖
        </div>
      )}
      <div className={`max-w-[82%] space-y-2`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-blue-500 text-white rounded-br-sm"
              : "bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm"
          }`}
        >
          {message.content}
        </div>

        {message.suggestedTasks && message.suggestedTasks.length > 0 && (
          <div className="space-y-1.5">
            {message.suggestedTasks.map((task, i) => {
              const cat = CATEGORY_CONFIG[task.category];
              return (
                <div
                  key={i}
                  className="bg-white border border-blue-100 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span>{cat.emoji}</span>
                      <span className="text-xs font-medium text-gray-700 truncate">{task.title}</span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-400 ml-4 truncate">{task.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onAddSuggestion?.(task)}
                    className="flex-shrink-0 flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-2 py-1 rounded-lg transition-colors"
                  >
                    <Plus size={11} />
                    Add
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
