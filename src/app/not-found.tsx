import Link from 'next/link';
import { Activity, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Activity className="h-24 w-24 text-blue-500" />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-600"
        >
          <Home className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
