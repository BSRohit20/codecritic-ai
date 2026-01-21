'use client';

import { CodeReviewResult } from '@/app/page';
import { AlertCircle, Shield, Zap, RefreshCw, CheckCircle2, TrendingUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import DiffViewer from './DiffViewer';
import PerformanceBenchmark from './PerformanceBenchmark';

interface ReviewResultsProps {
  result: CodeReviewResult;
  onApplyCode?: (code: string) => void;
  language?: string;
}

export default function ReviewResults({ result, onApplyCode, language = 'javascript' }: ReviewResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 border-green-500';
    if (score >= 60) return 'text-yellow-400 border-yellow-500';
    return 'text-red-400 border-red-500';
  };

  const getSeverityColor = (severity: string) => {
    if (!severity) return 'bg-blue-900/30 border-blue-500/50 text-blue-300';
    
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-900/30 border-red-500/50 text-red-300';
      case 'high':
        return 'bg-orange-900/30 border-orange-500/50 text-orange-300';
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300';
      default:
        return 'bg-blue-900/30 border-blue-500/50 text-blue-300';
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Overall Score */}
      <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Overall Score</h2>
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(result.overall_score)}`}>
            {result.overall_score}/100
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              result.overall_score >= 80
                ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                : result.overall_score >= 60
                ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                : 'bg-gradient-to-r from-red-500 to-rose-400'
            }`}
            style={{ width: `${result.overall_score}%` }}
          />
        </div>
      </div>

      {/* Bugs Section */}
      {result.bugs && result.bugs.length > 0 && (
        <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-semibold text-white">Bugs Found</h2>
            <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded text-sm font-medium">
              {result.bugs.length}
            </span>
          </div>
          <div className="space-y-3">
            {result.bugs.map((bug, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-r ${getSeverityColor(bug.severity)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {bug.severity || 'N/A'}
                      </span>
                      <span className="text-slate-400 text-xs">Line {bug.line || 'N/A'}</span>
                    </div>
                    <p className="text-white mb-2">{bug.description || 'No description provided'}</p>
                    {bug.suggestion && (
                      <div className="bg-slate-900/50 rounded p-2 text-sm font-mono text-slate-300">
                        {bug.suggestion}
                      </div>
                    )}
                  </div>
                  {bug.suggestion && (
                    <button
                      onClick={() => copyToClipboard(bug.suggestion, `bug-${index}`)}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                      title="Copy suggestion"
                    >
                      {copiedId === `bug-${index}` ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Issues Section */}
      {result.security_issues && result.security_issues.length > 0 && (
        <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Security Issues</h2>
            <span className="bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded text-sm font-medium">
              {result.security_issues.length}
            </span>
          </div>
          <div className="space-y-3">
            {result.security_issues.map((issue, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-r ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {issue.severity || 'N/A'}
                      </span>
                      <span className="text-slate-400 text-xs">Line {issue.line || 'N/A'}</span>
                    </div>
                    <p className="text-white mb-2">{issue.description || 'No description provided'}</p>
                    {issue.recommendation && (
                      <div className="bg-slate-900/50 rounded p-2 text-sm font-mono text-slate-300">
                        {issue.recommendation}
                      </div>
                    )}
                  </div>
                  {issue.recommendation && (
                    <button
                      onClick={() => copyToClipboard(issue.recommendation, `security-${index}`)}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                      title="Copy recommendation"
                    >
                      {copiedId === `security-${index}` ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tips Section */}
      {result.performance_tips && result.performance_tips.length > 0 && (
        <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Performance Tips</h2>
            <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded text-sm font-medium">
              {result.performance_tips.length}
            </span>
          </div>
          <div className="space-y-3">
            {result.performance_tips.map((tip, index) => (
              <div
                key={index}
                className="border-l-4 border-purple-500/50 bg-purple-900/20 p-4 rounded-r"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-400 text-xs">Line {tip.line || 'N/A'}</span>
                    </div>
                    <p className="text-white mb-2">{tip.description || 'No description provided'}</p>
                    {tip.optimization && (
                      <div className="bg-slate-900/50 rounded p-2 text-sm font-mono text-slate-300">
                        {tip.optimization}
                      </div>
                    )}
                  </div>
                  {tip.optimization && (
                    <button
                      onClick={() => copyToClipboard(tip.optimization, `perf-${index}`)}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                      title="Copy optimization"
                    >
                      {copiedId === `perf-${index}` ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refactoring Suggestions Section with DiffViewer */}
      {result.refactoring_suggestions && result.refactoring_suggestions.length > 0 && (
        <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Refactoring Suggestions</h2>
            <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-sm font-medium">
              {result.refactoring_suggestions.length}
            </span>
          </div>
          <div className="space-y-4">
            {result.refactoring_suggestions.map((suggestion, index) => (
              <DiffViewer
                key={index}
                originalCode={suggestion.current_code || 'N/A'}
                improvedCode={suggestion.improved_code || 'N/A'}
                language={language}
                description={`Lines ${suggestion.line_range || 'N/A'}: ${suggestion.description || 'No description provided'}`}
                onApply={onApplyCode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Performance Benchmarking */}
      <PerformanceBenchmark
        complexityAnalysis={result.complexity_analysis}
        performanceTips={result.performance_tips}
      />
    </div>
  );
}
