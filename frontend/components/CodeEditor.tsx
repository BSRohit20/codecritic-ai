'use client';

import { useRef, useEffect } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
}

export default function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  const lines = code.split('\n');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);
      return () => textarea.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  return (
    <div className="relative flex bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      {/* Line Numbers */}
      <div 
        ref={lineNumbersRef}
        className="flex-shrink-0 bg-slate-800 py-4 px-3 text-slate-500 text-sm font-mono select-none border-r border-slate-700 overflow-hidden h-96"
      >
        {lines.map((_, index) => (
          <div key={index} className="text-right" style={{ lineHeight: '1.5rem' }}>
            {index + 1}
          </div>
        ))}
      </div>
      
      {/* Code Editor */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-96 p-4 bg-slate-900 text-slate-100 font-mono text-sm focus:outline-none resize-none"
        placeholder="Paste your code here..."
        spellCheck={false}
        style={{
          tabSize: 2,
          lineHeight: '1.5rem',
        }}
      />
    </div>
  );
}
