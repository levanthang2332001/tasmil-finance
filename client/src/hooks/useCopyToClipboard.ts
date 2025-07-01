import { useCallback, useState, useRef } from "react";

interface UseCopyToClipboardOptions {
  timeout?: number;
}

interface UseCopyToClipboardResult {
  isCopied: boolean;
  copyToClipboard: (value: string) => Promise<boolean>;
}

export function useCopyToClipboard({
  timeout = 2000,
}: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const copyToClipboard = useCallback(
    async (value: string): Promise<boolean> => {
      if (typeof window === "undefined") {
        return false;
      }

      if (!value?.trim()) {
        return false;
      }

      try {
        // Try modern clipboard API first
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          setIsCopied(true);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = value;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);
          
          if (!successful) {
            throw new Error("Copy command failed");
          }
          
          setIsCopied(true);
        }

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsCopied(false);
        }, timeout);

        return true;
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        return false;
      }
    },
    [timeout]
  );

  return { isCopied, copyToClipboard };
}
