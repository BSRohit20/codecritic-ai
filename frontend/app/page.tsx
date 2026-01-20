'use client';

import { useState } from 'react';
import { Code2, Sparkles, AlertCircle, Shield, Zap, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import ReviewResults from '@/components/ReviewResults';
import LoadingState from '@/components/LoadingState';

export interface CodeReviewResult {
  overall_score: number;
  summary: string;
  strengths: string[];
  bugs: Array<{
    line?: number;
    severity: string;
    description: string;
    suggestion: string;
  }>;
  security_issues: Array<{
    line?: number;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  performance_tips: Array<{
    line?: number;
    description: string;
    optimization: string;
  }>;
  refactoring_suggestions: Array<{
    line_range: string;
    description: string;
    current_code: string;
    improved_code: string;
  }>;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
];

const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }
  return total;
}`;

export default function Home() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to review code. Please try again.');
      console.error('Review error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-white">CodeCritic AI</h1>
                <p className="text-sm text-slate-400">Intelligent Code Analysis Powered by Pydantic AI</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in">
          <div className="inline-flex items-center gap-2 bg-primary-900/30 border border-primary-600/30 text-primary-300 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Instant AI-Powered Code Analysis</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Review Your Code in <span className="text-primary-400">Seconds</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get detailed feedback on bugs, security issues, performance, and code quality
          </p>
        </div>

        {/* Editor Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary-400" />
                Your Code
              </h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <CodeEditor code={code} onChange={setCode} language={language} />

            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-lg shadow-lg shadow-primary-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Review Code
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3 animate-in">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-300">Error</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              Review Results
            </h3>

            {loading && <LoadingState />}
            {result && <ReviewResults result={result} />}
            {!loading && !result && !error && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
                <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">
                  Paste your code and click Review to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          {[
            { icon: AlertCircle, title: 'Bug Detection', desc: 'Find and fix issues' },
            { icon: Shield, title: 'Security Scan', desc: 'Identify vulnerabilities' },
            { icon: Zap, title: 'Performance Tips', desc: 'Optimize your code' },
            { icon: RefreshCw, title: 'Refactoring', desc: 'Improve code quality' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center hover:border-primary-500/50 transition-colors">
              <feature.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
