import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface MessageMarkdownProps {
  children: string;
}

const MessageMarkdown = ({ children }: MessageMarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-medium mb-2 mt-3">{children}</h4>,
        h5: ({ children }) => <h5 className="text-sm font-medium mb-1 mt-2">{children}</h5>,
        h6: ({ children }) => <h6 className="text-xs font-medium mb-1 mt-2">{children}</h6>,
        p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            );
          }
          return (
            <code className="block bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="mb-4">{children}</pre>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
        ),
        li: ({ children }) => <li className="ml-4">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic mb-3 text-muted-foreground">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MessageMarkdown;
