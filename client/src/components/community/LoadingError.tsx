interface LoadingErrorProps {
  error: string;
  onRetry?: () => void;
}

export function LoadingError({ error, onRetry }: LoadingErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-3">
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Retry
      </button>
    </div>
  );
}
