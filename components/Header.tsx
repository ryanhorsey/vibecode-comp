"use client";

import { Flame, Smile } from "lucide-react";
import { BoardState, CheckIn } from "@/lib/types";
import { MOOD_CONFIG } from "@/lib/constants";

interface HeaderProps {
  boardState: BoardState;
  onMoodCheck: () => void;
}

export function Header({ boardState, onMoodCheck }: HeaderProps) {
  const completedToday = boardState.tasks.filter((t) => {
    if (!t.completedAt) return false;
    return new Date(t.completedAt).toDateString() === new Date().toDateString();
  }).length;

  const lastMood = boardState.checkIns[boardState.checkIns.length - 1] as CheckIn | undefined;
  const moodEmoji = lastMood ? MOOD_CONFIG.find((m) => m.value === lastMood.mood)?.emoji : null;

  return (
    <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-sky-300 rounded-2xl flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white font-bold text-lg">C</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">CareBoard</h1>
          <p className="text-xs text-gray-400">Your wellness kanban</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak */}
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-500 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
          <Flame size={14} className="text-orange-400" />
          <span>{boardState.streak}</span>
          <span className="text-xs font-normal text-orange-400">day streak</span>
        </div>

        {/* Completed today */}
        {completedToday > 0 && (
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-600 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
            <span>✅</span>
            <span>{completedToday} today</span>
          </div>
        )}

        {/* Mood check button */}
        <button
          onClick={onMoodCheck}
          className="flex items-center gap-1.5 bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm"
        >
          {moodEmoji ? (
            <span className="text-base">{moodEmoji}</span>
          ) : (
            <Smile size={14} />
          )}
          <span>Check in</span>
        </button>
      </div>
    </header>
  );
}
