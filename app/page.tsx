"use client";

import { useState, useCallback, useEffect } from "react";
import { BoardProvider, useBoardStore } from "@/hooks/useBoardStore";
import { KanbanBoard } from "@/components/KanbanBoard";
import { BaymaxMascot } from "@/components/BaymaxMascot";
import { ChatPanel } from "@/components/ChatPanel";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { Header } from "@/components/Header";
import { CelebrationToast } from "@/components/CelebrationToast";
import { SuggestedTask, Task } from "@/lib/types";
import { DEFAULT_WELLNESS_TASKS } from "@/lib/constants";

function AppContent() {
  const { state, addTask, addCheckIn } = useBoardStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [pendingSuggestions, setPendingSuggestions] = useState<SuggestedTask[]>([]);
  const [celebration, setCelebration] = useState<Task | null>(null);
  const [mascotMood, setMascotMood] = useState<"happy" | "concerned" | "celebrating" | "idle">("idle");
  const [showWelcome, setShowWelcome] = useState(false);

  // Onboarding: populate default tasks on first load
  useEffect(() => {
    if (state.tasks.length === 0 && state.checkIns.length === 0) {
      const starter = DEFAULT_WELLNESS_TASKS.slice(0, 4);
      starter.forEach((t) => addTask(t.title, t.category));
      setShowWelcome(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs only once

  const handleAddSuggestion = useCallback(
    (suggestion: SuggestedTask) => {
      addTask(suggestion.title, suggestion.category, suggestion.description);
      setPendingSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
    },
    [addTask]
  );

  const handleSuggestionReceived = useCallback((suggestions: SuggestedTask[]) => {
    setPendingSuggestions((prev) => {
      const existingTitles = new Set(prev.map((s) => s.title));
      const newOnes = suggestions.filter((s) => !existingTitles.has(s.title));
      return [...prev, ...newOnes];
    });
  }, []);

  const handleDismissSuggestion = useCallback((suggestion: SuggestedTask) => {
    setPendingSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
  }, []);

  const handleTaskCompleted = useCallback((task: Task) => {
    setCelebration(task);
    setMascotMood("celebrating");
    setTimeout(() => setMascotMood("idle"), 3000);
  }, []);

  const handleMoodSubmit = useCallback(
    (mood: 1 | 2 | 3 | 4 | 5, notes?: string) => {
      addCheckIn(mood, notes);
      if (mood <= 2) {
        setMascotMood("concerned");
        setTimeout(() => setMascotMood("idle"), 5000);
      } else if (mood >= 4) {
        setMascotMood("happy");
        setTimeout(() => setMascotMood("idle"), 3000);
      }
    },
    [addCheckIn]
  );

  const lastMood = state.checkIns[state.checkIns.length - 1] ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Welcome overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center animate-scale-in">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Hello! I&apos;m CareBot</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              I&apos;m your personal wellness companion. I&apos;ve added some starter tasks to your board to help you build healthy habits.
            </p>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Drag tasks between columns, chat with me anytime, and check in with your mood regularly. I&apos;m here to help you thrive! 💙
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWelcome(false);
                  setMoodOpen(true);
                }}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Check in my mood
              </button>
              <button
                onClick={() => setShowWelcome(false)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Let&apos;s get started!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 pb-32">
        <Header boardState={state} onMoodCheck={() => setMoodOpen(true)} />
        <KanbanBoard
          suggestions={pendingSuggestions}
          onAcceptSuggestion={handleAddSuggestion}
          onDismissSuggestion={handleDismissSuggestion}
          onTaskCompleted={handleTaskCompleted}
        />
      </div>

      <BaymaxMascot
        onOpen={() => setChatOpen(true)}
        isOpen={chatOpen}
        mood={mascotMood}
        isTalking={chatOpen}
      />

      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        boardState={state}
        onAddSuggestion={handleAddSuggestion}
        onSuggestionReceived={handleSuggestionReceived}
      />

      {moodOpen && (
        <MoodCheckIn
          onSubmit={handleMoodSubmit}
          onClose={() => setMoodOpen(false)}
          lastMood={lastMood}
        />
      )}

      {celebration && (
        <CelebrationToast
          taskTitle={celebration.title}
          onDone={() => setCelebration(null)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <BoardProvider>
      <AppContent />
    </BoardProvider>
  );
}
