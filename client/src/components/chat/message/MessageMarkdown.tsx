import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import { truncateAddress } from "@aptos-labs/ts-sdk";
import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageMarkdownProps {
  children: string;
}

export function MessageMarkdown({ children }: MessageMarkdownProps) {
  return (
    <TooltipProvider>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-black">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 text-black">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mb-2 text-black">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium mb-2 text-black">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-medium mb-1 text-black">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-medium mb-1 text-black">{children}</h6>
          ),
          p: ({ children }) => <p className="mb-3 leading-relaxed text-black">{children}</p>,
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline)
              return (
                <code className="bg-neutral-900 px-2 py-1 rounded-md text-sm font-mono text-black border border-neutral-700">
                  {children}
                </code>
              );
            return (
              <code className="block bg-neutral-900 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-neutral-700 shadow-sm text-black">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-6 bg-neutral-900 p-4 rounded-lg border border-neutral-700 shadow-sm overflow-x-auto text-black">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-black">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-black">{children}</ol>
          ),
          li: ({ children }) => <li className="ml-6 leading-relaxed text-black">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-6 italic mb-4 text-black bg-neutral-900/70 py-3 rounded-r-lg">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
          em: ({ children }) => <em className="italic text-black">{children}</em>,
          a: ({ children, href }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={href}
                  className="text-blue-400 inline-flex items-center gap-1 hover:text-blue-300 hover:underline font-medium transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateAddress(children as string)}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <span>{href}</span>
              </TooltipContent>
            </Tooltip>
          ),
          table: ({ children }) => (
            <table className="min-w-full bg-neutral-900 text-black border border-neutral-700 rounded-lg mb-4">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 border-b border-neutral-700 font-semibold text-black bg-neutral-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-neutral-700 text-black">{children}</td>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
        }}
      >
        {children}
      </ReactMarkdown>
    </TooltipProvider>
  );
}

export default MessageMarkdown;
