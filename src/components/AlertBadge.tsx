'use client';

import { AlertTriangle } from 'lucide-react';

interface AlertBadgeProps {
  message: string;
  type?: 'warning' | 'critical';
}

export function AlertBadge({ message, type = 'warning' }: AlertBadgeProps) {
  const bgColor = type === 'critical' ? 'bg-red-500' : 'bg-yellow-500';
  const textColor = type === 'critical' ? 'text-white' : 'text-black';

  return (
    <div className={`flex items-center gap-2 rounded-lg ${bgColor} ${textColor} px-4 py-2 shadow-lg animate-pulse`}>
      <AlertTriangle className="h-5 w-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
