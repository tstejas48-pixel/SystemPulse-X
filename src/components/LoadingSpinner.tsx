import { RefreshCw } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="h-12 w-12 animate-spin text-blue-500" />
        <span className="text-xl font-semibold text-gray-900 dark:text-white">{message}</span>
      </div>
    </div>
  );
}
