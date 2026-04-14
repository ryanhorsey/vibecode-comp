import { BoardState, SuggestedTask } from "@/lib/types";
import { DEFAULT_WELLNESS_TASKS } from "@/lib/constants";

interface CarebotResponse {
  content: string;
  suggestions: SuggestedTask[];
}

const LOW_ENERGY_KEYWORDS = ["sad", "stressed", "anxious", "overwhelmed", "tired", "burned out"];
const HIGH_ENERGY_KEYWORDS = ["great", "good", "happy", "excited", "awesome", "motivated"];
const HELP_KEYWORDS = ["help", "what should i do", "suggest", "stuck", "where to start"];

function containsAnyKeyword(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}

function buildSuggestions(boardState: BoardState, limit = 2): SuggestedTask[] {
  const existingTitles = new Set(boardState.tasks.map((task) => task.title.toLowerCase()));
  return DEFAULT_WELLNESS_TASKS.filter(
    (task) => !existingTitles.has(task.title.toLowerCase())
  ).slice(0, limit);
}

export function getCarebotResponse(userInput: string, boardState: BoardState): CarebotResponse {
  const normalized = userInput.toLowerCase().trim();
  const todoCount = boardState.tasks.filter((task) => task.column === "todo").length;
  const doneCount = boardState.tasks.filter((task) => task.column === "done").length;
  const latestMood = boardState.checkIns[boardState.checkIns.length - 1]?.mood;

  if (containsAnyKeyword(normalized, LOW_ENERGY_KEYWORDS)) {
    return {
      content:
        "Thank you for telling me that. Let's keep things very small and gentle right now. Would you like to pick one tiny self-care task and move at your own pace?",
      suggestions: buildSuggestions(boardState, 2),
    };
  }

  if (containsAnyKeyword(normalized, HIGH_ENERGY_KEYWORDS)) {
    return {
      content:
        "I love hearing that. Let's use this momentum in a healthy way. Pick one meaningful task now, then schedule a short break after it so you can sustain your energy.",
      suggestions: buildSuggestions(boardState, 1),
    };
  }

  if (containsAnyKeyword(normalized, HELP_KEYWORDS)) {
    return {
      content:
        "Absolutely. Start with one task from your To Do column that takes under 10 minutes. After you finish it, move it to Done so we can build momentum together.",
      suggestions: buildSuggestions(boardState, 2),
    };
  }

  if (todoCount > 5) {
    return {
      content:
        "Your board has a lot queued up, which can feel heavy. Try choosing only one priority task for now and postpone the rest mentally until that one is done.",
      suggestions: buildSuggestions(boardState, 1),
    };
  }

  if (doneCount >= 3) {
    return {
      content:
        "You've completed several tasks already, and that's awesome progress. Before the next task, consider a quick reset break so your focus stays strong.",
      suggestions: buildSuggestions(boardState, 1),
    };
  }

  if (latestMood && latestMood <= 2) {
    return {
      content:
        "I noticed your recent mood check-in looked low. Let's prioritize kindness to yourself today: one tiny task, one short break, and one positive check-in later.",
      suggestions: buildSuggestions(boardState, 2),
    };
  }

  return {
    content:
      "I'm here with you. Want to choose one small wellness step right now? Small consistent actions can make a big difference.",
    suggestions: buildSuggestions(boardState, 1),
  };
}
