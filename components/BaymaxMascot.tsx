"use client";

import { useState, useEffect } from "react";
import { BAYMAX_CHECKIN_PROMPTS } from "@/lib/constants";

interface BaymaxMascotProps {
  onOpen: () => void;
  isOpen: boolean;
  isTalking?: boolean;
  mood?: "happy" | "concerned" | "celebrating" | "idle";
}

export function BaymaxMascot({ onOpen, isOpen, isTalking, mood = "idle" }: BaymaxMascotProps) {
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [blinking, setBlinking] = useState(false);

  // Periodic speech bubble prompts when chat is closed
  useEffect(() => {
    if (isOpen) {
      setSpeechBubble(null);
      return;
    }

    const showPrompt = () => {
      const prompt = BAYMAX_CHECKIN_PROMPTS[Math.floor(Math.random() * BAYMAX_CHECKIN_PROMPTS.length)];
      setSpeechBubble(prompt);
      setTimeout(() => setSpeechBubble(null), 6000);
    };

    // Show first prompt after 5 seconds
    const initial = setTimeout(showPrompt, 5000);
    // Then every 90 seconds
    const interval = setInterval(showPrompt, 90000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [isOpen]);

  // Blinking animation
  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    };
    const interval = setInterval(blink, 3500);
    return () => clearInterval(interval);
  }, []);

  const eyeStyle = blinking ? "scale-y-[0.1]" : "scale-y-100";

  const bodyColor = mood === "celebrating" ? "bg-blue-100" : "bg-white";
  const glowColor =
    mood === "celebrating"
      ? "shadow-blue-300/60"
      : mood === "concerned"
      ? "shadow-orange-200/60"
      : "shadow-blue-200/40";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Speech bubble */}
      {speechBubble && !isOpen && (
        <div className="max-w-[220px] bg-white rounded-2xl rounded-br-sm shadow-lg border border-blue-100 px-4 py-3 animate-bubble-in">
          <p className="text-sm text-gray-600 leading-snug">{speechBubble}</p>
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-blue-100 rotate-45" />
        </div>
      )}

      {/* Mascot button */}
      <button
        onClick={onOpen}
        className={`
          relative w-20 h-24 rounded-[40px] ${bodyColor} shadow-xl ${glowColor}
          shadow-[0_8px_32px_0_rgba(99,179,237,0.3)]
          hover:scale-110 active:scale-95 transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-blue-200
          ${mood === "celebrating" ? "animate-celebrate" : "animate-bob"}
          ${isTalking ? "animate-talking" : ""}
          border-2 border-blue-100/50
        `}
        aria-label="Open CareBot"
      >
        {/* Head */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-14 bg-white rounded-[32px] border-2 border-blue-100/50 shadow-sm flex items-center justify-center">
          {/* Eyes */}
          <div className="flex gap-3 items-center">
            <div
              className={`w-3 h-3 bg-gray-800 rounded-full transition-transform duration-100 ${eyeStyle} ${
                mood === "concerned" ? "bg-orange-600" : ""
              }`}
            />
            {mood === "happy" || mood === "celebrating" ? (
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            ) : null}
            <div
              className={`w-3 h-3 bg-gray-800 rounded-full transition-transform duration-100 ${eyeStyle} ${
                mood === "concerned" ? "bg-orange-600" : ""
              }`}
            />
          </div>

          {/* Mouth line */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-px bg-gray-300 rounded-full" />
        </div>

        {/* Body lines (Baymax chest detail) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-px bg-blue-200 rounded-full" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-px bg-blue-100 rounded-full" />

        {/* Arms */}
        <div className="absolute top-6 -left-3 w-5 h-10 bg-white rounded-full border border-blue-100/50 shadow-sm" />
        <div className="absolute top-6 -right-3 w-5 h-10 bg-white rounded-full border border-blue-100/50 shadow-sm" />

        {/* Legs */}
        <div className="absolute -bottom-3 left-3 w-5 h-7 bg-white rounded-full border border-blue-100/50 shadow-sm" />
        <div className="absolute -bottom-3 right-3 w-5 h-7 bg-white rounded-full border border-blue-100/50 shadow-sm" />

        {/* Notification dot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
        )}
      </button>
    </div>
  );
}
