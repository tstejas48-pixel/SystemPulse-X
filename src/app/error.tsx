'use client';

import { Activity, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Activity className="h-24 w-24 text-red-500" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Something went wrong!</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-600"
        >
          <RefreshCw className="h-5 w-5" />
          Try Again
        </button>
      </div>
    </div>
  );
}
