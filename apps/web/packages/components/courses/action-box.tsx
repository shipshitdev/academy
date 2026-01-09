"use client";

import { Button } from "@shipshitdev/ui";
import type { LessonAction } from "@interfaces/lesson.interface";
import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";

interface ActionBoxProps {
  action: LessonAction;
}

export function ActionBox({ action }: ActionBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(action.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="group relative my-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
      <div className="flex items-center justify-between border-b border-primary/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{action.title}</span>
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

      {action.description && (
        <div className="border-b border-primary/10 px-4 py-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
        </div>
      )}

      <div className="px-4 py-4">
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground font-medium">
          {action.content}
        </pre>
      </div>
    </div>
  );
}
