import { TaskCategory, ColumnId } from "./types";

export const COLUMNS: { id: ColumnId; label: string; emoji: string }[] = [
  { id: "todo", label: "To Do", emoji: "📋" },
  { id: "in-progress", label: "In Progress", emoji: "⚡" },
  { id: "done", label: "Done", emoji: "✅" },
];

export const CATEGORY_CONFIG: Record<
  TaskCategory,
  { label: string; color: string; bg: string; border: string; emoji: string }
> = {
  mindfulness: {
    label: "Mindfulness",
    color: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-200",
    emoji: "🧘",
  },
  exercise: {
    label: "Exercise",
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-200",
    emoji: "🏃",
  },
  social: {
    label: "Social",
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    border: "border-yellow-200",
    emoji: "👥",
  },
  learning: {
    label: "Learning",
    color: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-200",
    emoji: "📚",
  },
  "self-care": {
    label: "Self-Care",
    color: "text-pink-700",
    bg: "bg-pink-100",
    border: "border-pink-200",
    emoji: "💆",
  },
  custom: {
    label: "Custom",
    color: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-200",
    emoji: "⭐",
  },
};

export const MOOD_CONFIG: {
  value: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  label: string;
  color: string;
}[] = [
  { value: 1, emoji: "😢", label: "Rough", color: "text-red-500" },
  { value: 2, emoji: "😕", label: "Low", color: "text-orange-500" },
  { value: 3, emoji: "😐", label: "Okay", color: "text-yellow-500" },
  { value: 4, emoji: "🙂", label: "Good", color: "text-lime-500" },
  { value: 5, emoji: "😄", label: "Great", color: "text-green-500" },
];

export const DEFAULT_WELLNESS_TASKS = [
  { title: "Take a 5-minute mindful breathing break", category: "mindfulness" as TaskCategory },
  { title: "Go for a 10-minute walk outside", category: "exercise" as TaskCategory },
  { title: "Drink a full glass of water", category: "self-care" as TaskCategory },
  { title: "Reach out to a friend or family member", category: "social" as TaskCategory },
  { title: "Read for 15 minutes", category: "learning" as TaskCategory },
  { title: "Do 5 minutes of stretching", category: "exercise" as TaskCategory },
  { title: "Write 3 things you're grateful for", category: "mindfulness" as TaskCategory },
  { title: "Take a short screen break", category: "self-care" as TaskCategory },
];

export const BAYMAX_CHECKIN_PROMPTS = [
  "Hi there! How are you feeling today? 💙",
  "I've been thinking about you. Have you taken a break recently?",
  "You matter to me. How's your energy level right now?",
  "Remember to be kind to yourself today. How are you doing?",
  "I noticed you've been working hard. How about a quick wellness check?",
];

export const STORAGE_KEYS = {
  BOARD_STATE: "careboard_state",
  CHAT_HISTORY: "careboard_chat",
};
