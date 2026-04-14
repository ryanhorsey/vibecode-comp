"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatMessage } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      // Only keep last 100 messages to avoid bloating storage
      const toSave = messages.slice(-100);
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(toSave));
    } catch {
      // ignore
    }
  }, [messages, hydrated]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch {
      // ignore
    }
  }, []);

  return { messages, addMessage, clearHistory };
}
