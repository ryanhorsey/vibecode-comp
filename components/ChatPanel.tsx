"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Trash2 } from "lucide-react";
import { ChatMessage, SuggestedTask, BoardState } from "@/lib/types";
import { useChatHistory } from "@/hooks/useChatHistory";
import { ChatMessageBubble } from "./ChatMessage";
import { getCarebotResponse } from "@/lib/carebot-rules";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  boardState: BoardState;
  onAddSuggestion: (suggestion: SuggestedTask) => void;
  onSuggestionReceived: (suggestions: SuggestedTask[]) => void;
}

export function ChatPanel({
  isOpen,
  onClose,
  boardState,
  onAddSuggestion,
  onSuggestionReceived,
}: ChatPanelProps) {
  const { messages, addMessage, clearHistory } = useChatHistory();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput("");
    setIsLoading(true);

    const { content, suggestions } = getCarebotResponse(text, boardState);

    // Simulate a short "thinking" delay to preserve chat feel.
    await new Promise((resolve) => setTimeout(resolve, 450));

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      suggestedTasks: suggestions.length > 0 ? suggestions : undefined,
    };
    addMessage(assistantMsg);
    if (suggestions.length > 0) {
      onSuggestionReceived(suggestions);
    }
    setIsLoading(false);
  }, [input, isLoading, addMessage, boardState, onSuggestionReceived]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed bottom-0 right-0 z-50 flex flex-col bg-gradient-to-b from-sky-50 to-white
          shadow-2xl border-l border-t border-blue-100 rounded-tl-3xl
          transition-all duration-300 ease-out
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          w-full sm:w-[400px] h-[85vh] sm:h-[600px]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-2xl border border-blue-100 shadow-sm flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">CareBot</h3>
              <p className="text-xs text-blue-400">Your wellness companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearHistory}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Clear history"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8 px-4">
              <div className="text-5xl mb-3">🤖</div>
              <p className="text-gray-500 text-sm font-medium">
                Hi! I&apos;m CareBot, your personal wellness companion.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                I&apos;m here to check in on you and help with your wellbeing tasks. How are you
                feeling today?
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              onAddSuggestion={onAddSuggestion}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 text-sm">
                🤖
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-blue-100">
          <div className="flex gap-2 items-end bg-white rounded-2xl border border-blue-200 px-3 py-2.5 focus-within:border-blue-400 transition-colors shadow-sm">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talk to CareBot..."
              rows={1}
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none resize-none bg-transparent max-h-24"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white rounded-xl transition-colors flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-300 text-center mt-1.5">Press Enter to send</p>
        </div>
      </div>
    </>
  );
}
