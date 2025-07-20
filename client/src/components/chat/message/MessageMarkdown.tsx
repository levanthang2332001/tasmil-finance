import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import { truncateAddress } from "@aptos-labs/ts-sdk";
import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isAptosLink } from "@/lib/utils";

interface MessageMarkdownProps {
  children: string;
}

export function MessageMarkdown({ children }: MessageMarkdownProps) {
  return (
    <TooltipProvider>
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 text-slate-900">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-3 text-slate-900">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2 text-slate-900">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-medium mb-2 text-slate-900">
                {children}
              </h4>
            ),
            h5: ({ children }) => (
              <h5 className="text-sm font-medium mb-1 text-slate-900">
                {children}
              </h5>
            ),
            h6: ({ children }) => (
              <h6 className="text-xs font-medium mb-1 text-slate-900">
                {children}
              </h6>
            ),
            p: ({ children }) => (
              <p className="mb-3 leading-relaxed text-slate-800 break-words whitespace-pre-wrap">
                {children}
              </p>
            ),
            code: ({ children, className }) => {
              const isInline = !className;
              if (isInline)
                return (
                  <code className="bg-slate-100 px-2 py-1 rounded-md text-sm font-mono text-slate-800 border border-slate-200 font-normal">
                    {children}
                  </code>
                );
              return (
                <code className="block bg-slate-50 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-slate-200 shadow-sm text-slate-800 font-normal">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm overflow-x-auto text-slate-800 font-normal">
                {children}
              </pre>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-slate-800">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-800">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="ml-6 leading-relaxed text-slate-800">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-6 italic mb-4 text-slate-700 bg-blue-50 py-3 rounded-r-lg">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-slate-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-slate-800">{children}</em>
            ),
            a: ({ children, href }) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={href}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {truncateAddress(children as string)}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </TooltipTrigger>
                {href && isAptosLink(href) && (
                  <TooltipContent>
                    <span>View on Aptos Explorer</span>
                  </TooltipContent>
                )}
              </Tooltip>
            ),
            table: ({ children }) => (
              <table className="min-w-full bg-white text-slate-800 border border-slate-200 rounded-lg mb-4">
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 border-b border-slate-200 font-semibold text-slate-900 bg-slate-50">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 border-b border-slate-200 text-slate-800">
                {children}
              </td>
            ),
            tr: ({ children }) => <tr>{children}</tr>,
          }}
        >
          {children}
        </ReactMarkdown>
      </div>
    </TooltipProvider>
  );
}

export default MessageMarkdown;
