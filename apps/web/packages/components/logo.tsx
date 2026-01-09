"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    icon: "h-6 w-6",
    text: "text-base",
    container: "gap-2",
  },
  md: {
    icon: "h-8 w-8",
    text: "text-lg",
    container: "gap-2.5",
  },
  lg: {
    icon: "h-10 w-10",
    text: "text-xl",
    container: "gap-3",
  },
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = sizeClasses[size];

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center font-semibold text-foreground transition-opacity hover:opacity-80",
        sizes.container,
        className
      )}
    >
      <div className="flex items-center justify-center rounded-lg bg-primary p-1.5 shadow-md shadow-primary/25">
        <BookOpen className={cn("text-primary-foreground", sizes.icon)} />
      </div>
      {showText && (
        <span className={cn("font-semibold", sizes.text)}>Academy</span>
      )}
    </Link>
  );
}
