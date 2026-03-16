import { useState } from "react";

export default function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = async (text) => {
    if (!text) return false;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);

      // Reset copied state after timeout
      setTimeout(() => {
        setCopied(false);
      }, timeout);

      return true;
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      setError("Failed to copy text");
      setCopied(false);
      return false;
    }
  };

  return { copy, copied, error };
}