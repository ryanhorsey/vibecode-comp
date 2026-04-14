"use client";

import { useEffect, useState } from "react";

interface CelebrationToastProps {
  taskTitle: string;
  onDone: () => void;
}

const MESSAGES = [
  "Amazing work! 🌟",
  "You did it! 🎉",
  "That's fantastic! 💫",
  "Keep it up! 🚀",
  "So proud of you! 💙",
];

export function CelebrationToast({ taskTitle, onDone }: CelebrationToastProps) {
  const [visible, setVisible] = useState(true);
  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-xl border border-green-200 px-5 py-3.5 flex items-center gap-3 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <span className="text-2xl">🎊</span>
      <div>
        <p className="font-bold text-gray-800 text-sm">{msg}</p>
        <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
          &quot;{taskTitle}&quot; completed
        </p>
      </div>
    </div>
  );
}
