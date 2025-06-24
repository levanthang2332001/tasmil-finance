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
              <code className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono text-gray-800 border border-gray-200">
                {children}
              </code>
            );
          }
          return (
            <code className="block bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-gray-200 shadow-sm">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            {children}
          </pre>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="ml-6 leading-relaxed">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-6 italic mb-4 text-gray-600 bg-blue-50 py-3 rounded-r-lg">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-700">{children}</em>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
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
