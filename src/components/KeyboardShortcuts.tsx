"use client";

import { useEffect } from "react";

interface KeyboardShortcutsProps {
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export function KeyboardShortcuts({
  onPreviousDay,
  onNextDay,
  onToday,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          onPreviousDay();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNextDay();
          break;
        case "t":
          e.preventDefault();
          onToday();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPreviousDay, onNextDay, onToday]);

  return null;
}
