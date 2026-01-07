import type { IMarkdownRendererProps } from "@interfaces/markdown-renderer.interface";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: IMarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-h1:text-3xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-foreground prose-strong:font-semibold prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-muted-foreground prose-li:mb-2 prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
