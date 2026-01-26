'use client';

import { useState } from 'react';
import { Code2, Sparkles, AlertCircle, Shield, Zap, RefreshCw, CheckCircle2, XCircle, History, BookOpen, LogOut } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import ReviewResults from '@/components/ReviewResults';
import LoadingState from '@/components/LoadingState';
import ChatAssistant from '@/components/ChatAssistant';
import CodeHistory from '@/components/CodeHistory';
import SnippetLibrary from '@/components/SnippetLibrary';
import Collaboration from '@/components/Collaboration';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { useAuth } from '@/contexts/AuthContext';

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
  complexity_analysis?: {
    time_complexity: string;
    space_complexity: string;
    explanation: string;
    optimization_potential: string;
  };
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

export default function Home() {
  const { user, logout, loading: authLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setEmailResent(true);
        setTimeout(() => setEmailResent(false), 5000);
      }
    } catch (err) {
      console.error('Failed to resend email:', err);
    } finally {
      setResendingEmail(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

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
      const token = localStorage.getItem('token');
      
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
      
      // Save to history in database
      if (token) {
        try {
          await fetch(`${apiUrl}/api/history/save`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              code,
              language,
              result: data
            }),
          });
        } catch (historyError) {
          console.error('Failed to save to history:', historyError);
          // Don't show error to user, just log it
        }
      }
    } catch (err: any) {
      // Enhanced error handling for rate limits
      let errorMessage = err.message || 'Failed to review code. Please try again.';
      
      if (err.message?.includes('Rate limit exceeded') || err.message?.includes('429')) {
        errorMessage = '⏱️ Free model rate limit reached (50 requests/day). The limit resets in a few hours. For unlimited access, consider adding credits to your OpenRouter account.';
      } else if (err.message?.includes('AI service unavailable')) {
        errorMessage = '🔄 AI model is temporarily overloaded. Please try again in a few moments.';
      } else if (err.message?.includes('Empty response')) {
        errorMessage = '⚠️ The AI model returned an empty response. This usually means it\'s overloaded. Please try again shortly.';
      }
      
      setError(errorMessage);
      console.error('Review error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Email Verification Banner */}
      {user && !user.email_verified && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-200">
                  Please verify your email to access all features. Check your inbox for the verification link.
                </span>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail || emailResent}
                className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {emailResent ? '✓ Email Sent' : resendingEmail ? 'Sending...' : 'Resend Email'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary-600 rounded-lg">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-extrabold text-white">CodeCritic AI</h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">Intelligent Code Analysis Powered by Pydantic AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-white font-medium">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm rounded-lg transition-colors"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 animate-in">
          <div className="inline-flex items-center gap-2 bg-primary-900/30 border border-primary-600/30 text-primary-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Instant AI-Powered Code Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">
            Review Your Code in <span className="text-primary-400">Seconds</span>
          </h2>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto px-4">
            Get detailed feedback on bugs, security issues, performance, and code quality
          </p>
          
          {/* Rate Limit Notice */}
          <div className="mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-2.5 sm:p-3">
              <p className="text-amber-200 text-xs sm:text-sm">
                ℹ️ <strong>Free tier:</strong> 50 requests per day. Limit resets every 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                Your Code
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Feature Buttons Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm rounded-lg transition-colors"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4" />
                History
              </button>
              <SnippetLibrary />
              <Collaboration code={code} language={language} reviewResult={result} />
            </div>

            <CodeEditor code={code} onChange={setCode} language={language} />

            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-lg shadow-lg shadow-primary-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Review Code
                </>
              )}
            </button>

            {error && (
              <div className="p-3 sm:p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-2 sm:gap-3 animate-in">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-300 text-sm sm:text-base">Error</p>
                  <p className="text-red-200 text-xs sm:text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
              Review Results
            </h3>

            {loading && <LoadingState />}
            {result && <ReviewResults result={result} onApplyCode={setCode} language={language} />}
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

        {/* Code History Section */}
        {showHistory && (
          <div className="mt-8 animate-in">
            <CodeHistory />
          </div>
        )}

        {/* Chat Assistant (Floating) */}
        <ChatAssistant 
          reviewResult={result} 
          originalCode={code} 
          language={language} 
        />

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-16">
          {[
            { icon: AlertCircle, title: 'Bug Detection', desc: 'Find and fix issues' },
            { icon: Shield, title: 'Security Scan', desc: 'Identify vulnerabilities' },
            { icon: Zap, title: 'Performance Tips', desc: 'Optimize your code' },
            { icon: RefreshCw, title: 'Refactoring', desc: 'Improve code quality' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 text-center hover:border-primary-500/50 transition-colors">
              <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h4>
              <p className="text-slate-400 text-xs sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
