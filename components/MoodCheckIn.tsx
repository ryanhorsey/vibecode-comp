"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { MOOD_CONFIG } from "@/lib/constants";
import { CheckIn } from "@/lib/types";

interface MoodCheckInProps {
  onSubmit: (mood: CheckIn["mood"], notes?: string) => void;
  onClose: () => void;
  lastMood?: CheckIn | null;
}

export function MoodCheckIn({ onSubmit, onClose, lastMood }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<CheckIn["mood"] | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood) return;
    onSubmit(selectedMood, notes.trim() || undefined);
    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">How are you feeling?</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {lastMood
                ? `Last check-in: ${new Date(lastMood.timestamp).toLocaleDateString()}`
                : "First check-in today!"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="text-4xl mb-3">
              {MOOD_CONFIG.find((m) => m.value === selectedMood)?.emoji}
            </div>
            <p className="text-gray-600 font-medium">Thanks for checking in! 💙</p>
            <p className="text-xs text-gray-400 mt-1">CareBot has been updated</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-5">
              {MOOD_CONFIG.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedMood(m.value)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all ${
                    selectedMood === m.value
                      ? "bg-blue-50 ring-2 ring-blue-300 scale-110"
                      : "hover:bg-gray-50 hover:scale-105"
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs text-gray-500 font-medium">{m.label}</span>
                </button>
              ))}
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to share? (optional)"
              rows={2}
              className="w-full text-sm text-gray-700 placeholder-gray-300 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-300 resize-none mb-4"
            />

            <button
              onClick={handleSubmit}
              disabled={!selectedMood}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Share with CareBot
            </button>
          </>
        )}
      </div>
    </div>
  );
}
