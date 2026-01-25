'use client';

import { useState } from 'react';
import { Copy, Check, ArrowRight, Code2 } from 'lucide-react';

interface DiffViewerProps {
  originalCode: string;
  improvedCode: string;
  language: string;
  description?: string;
  onApply?: (code: string) => void;
}

export default function DiffViewer({ 
  originalCode, 
  improvedCode, 
  language, 
  description,
  onApply 
}: DiffViewerProps) {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(improvedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(improvedCode);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    }
  };

  // Simple diff highlighting logic
  const getLineDiff = (original: string, improved: string) => {
    const originalLines = original.split('\n');
    const improvedLines = improved.split('\n');
    
    return {
      original: originalLines,
      improved: improvedLines
    };
  };

  const { original, improved } = getLineDiff(originalCode, improvedCode);

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
      {description && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-800 border-b border-slate-700">
          <p className="text-xs sm:text-sm text-slate-300">{description}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-slate-700">
        {/* Original Code */}
        <div className="bg-red-950/10">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-red-900/20 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <span className="text-xs sm:text-sm font-medium text-red-300">Current Code</span>
            </div>
          </div>
          <div className="p-3 sm:p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm">
              <code className="text-red-200">
                {original.map((line, idx) => (
                  <div key={idx} className="hover:bg-red-900/20 transition-colors">
                    <span className="inline-block w-6 sm:w-8 text-right mr-2 sm:mr-4 text-red-400/50 select-none text-xs sm:text-sm">
                      {idx + 1}
                    </span>
                    <span className="line-through opacity-70">{line || ' '}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>

        {/* Improved Code */}
        <div className="bg-green-950/10">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-green-900/20 border-b md:border-t-0 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              <span className="text-xs sm:text-sm font-medium text-green-300">Improved Code</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleCopy}
                className="p-1 sm:p-1.5 hover:bg-green-800/30 rounded transition-colors"
                title="Copy improved code"
              >
                {copied ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                )}
              </button>
              {onApply && (
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded transition-colors"
                  title="Apply this code"
                >
                  {applied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span className="hidden sm:inline">Applied!</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3 h-3" />
                      <span className="hidden sm:inline">Apply</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="p-3 sm:p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm">
              <code className="text-green-200">
                {improved.map((line, idx) => (
                  <div key={idx} className="hover:bg-green-900/20 transition-colors">
                    <span className="inline-block w-6 sm:w-8 text-right mr-2 sm:mr-4 text-green-400/50 select-none text-xs sm:text-sm">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{line || ' '}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
