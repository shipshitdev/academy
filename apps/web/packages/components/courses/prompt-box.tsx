"use client";

import { Button } from "@shipshitdev/ui";
import type { LessonPrompt } from "@interfaces/lesson.interface";
import { Check, Copy, MessageSquare } from "lucide-react";
import { useState } from "react";

interface PromptBoxProps {
  prompt: LessonPrompt;
}

export function PromptBox({ prompt }: PromptBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="group relative my-6 rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10 shadow-sm">
      <div className="flex items-center justify-between border-b border-blue-500/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-semibold text-foreground">{prompt.title}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {prompt.description && (
        <div className="border-b border-blue-500/10 px-4 py-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{prompt.description}</p>
        </div>
      )}

      <div className="px-4 py-4">
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground font-medium">
          {prompt.prompt}
        </pre>
      </div>
    </div>
  );
}
