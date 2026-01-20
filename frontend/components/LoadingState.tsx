'use client';

import { RefreshCw } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-12 h-12 text-primary-400 animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold text-white mb-2">Analyzing Your Code...</p>
          <p className="text-sm text-slate-400">Our AI is reviewing your code for bugs, security, and performance</p>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
