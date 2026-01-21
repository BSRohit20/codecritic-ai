'use client';

import { Zap, TrendingUp, Clock, Database, Info } from 'lucide-react';

interface ComplexityAnalysis {
  time_complexity: string;
  space_complexity: string;
  explanation: string;
  optimization_potential: string;
}

interface PerformanceBenchmarkProps {
  complexityAnalysis?: ComplexityAnalysis;
  performanceTips?: Array<{
    line?: number;
    description: string;
    optimization: string;
  }>;
}

export default function PerformanceBenchmark({ complexityAnalysis, performanceTips }: PerformanceBenchmarkProps) {
  if (!complexityAnalysis && (!performanceTips || performanceTips.length === 0)) {
    return null;
  }

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(1)') || complexity.includes('O(log n)')) return 'text-green-400';
    if (complexity.includes('O(n)')) return 'text-yellow-400';
    if (complexity.includes('O(n^2)') || complexity.includes('O(2^n)') || complexity.includes('O(n!)')) return 'text-red-400';
    return 'text-blue-400';
  };

  const getComplexityRating = (complexity: string) => {
    if (complexity.includes('O(1)')) return { label: 'Excellent', color: 'bg-green-500' };
    if (complexity.includes('O(log n)')) return { label: 'Great', color: 'bg-green-400' };
    if (complexity.includes('O(n)')) return { label: 'Good', color: 'bg-yellow-400' };
    if (complexity.includes('O(n log n)')) return { label: 'Fair', color: 'bg-yellow-500' };
    if (complexity.includes('O(n^2)')) return { label: 'Poor', color: 'bg-orange-500' };
    if (complexity.includes('O(2^n)') || complexity.includes('O(n!)')) return { label: 'Very Poor', color: 'bg-red-500' };
    return { label: 'Unknown', color: 'bg-gray-500' };
  };

  return (
    <div className="space-y-6">
      {/* Complexity Analysis */}
      {complexityAnalysis && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Algorithm Complexity Analysis
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Time Complexity */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-900/30 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Time Complexity</h4>
                    <p className={`text-3xl font-bold ${getComplexityColor(complexityAnalysis.time_complexity)}`}>
                      {complexityAnalysis.time_complexity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 ${getComplexityRating(complexityAnalysis.time_complexity).color} text-white text-sm font-semibold rounded-full`}>
                    {getComplexityRating(complexityAnalysis.time_complexity).label}
                  </div>
                </div>
              </div>

              {/* Complexity Scale Reference */}
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h5 className="text-xs font-semibold text-slate-400 mb-3">Common Time Complexities (Best → Worst)</h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded">O(1) Constant</span>
                  <span className="px-2 py-1 bg-green-900/20 text-green-300 rounded">O(log n) Logarithmic</span>
                  <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded">O(n) Linear</span>
                  <span className="px-2 py-1 bg-yellow-900/20 text-yellow-300 rounded">O(n log n) Linearithmic</span>
                  <span className="px-2 py-1 bg-orange-900/30 text-orange-300 rounded">O(n²) Quadratic</span>
                  <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded">O(2ⁿ) Exponential</span>
                </div>
              </div>
            </div>

            {/* Space Complexity */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-purple-900/30 rounded-lg">
                  <Database className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Space Complexity</h4>
                  <p className={`text-3xl font-bold ${getComplexityColor(complexityAnalysis.space_complexity)}`}>
                    {complexityAnalysis.space_complexity}
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-semibold text-blue-300 mb-2">Analysis</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">{complexityAnalysis.explanation}</p>
                </div>
              </div>
            </div>

            {/* Optimization Potential */}
            {complexityAnalysis.optimization_potential && (
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-semibold text-amber-300 mb-2">Optimization Potential</h5>
                    <p className="text-sm text-slate-300 leading-relaxed">{complexityAnalysis.optimization_potential}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Tips */}
      {performanceTips && performanceTips.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Performance Optimization Tips
            </h3>
          </div>
          <div className="divide-y divide-slate-700">
            {performanceTips.map((tip, index) => (
              <div key={index} className="p-6 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    {tip.line && (
                      <span className="inline-block px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded mb-2">
                        Line {tip.line}
                      </span>
                    )}
                    <h4 className="text-white font-medium mb-2">{tip.description}</h4>
                    <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                      <p className="text-sm text-green-300">
                        <strong className="text-green-400">💡 Optimization:</strong> {tip.optimization}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Score Card */}
      {complexityAnalysis && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-6">
          <h4 className="text-sm font-medium text-slate-400 mb-4">Performance Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-xs text-slate-400 mb-1">Time Efficiency</div>
              <div className="text-lg font-bold text-white">
                {getComplexityRating(complexityAnalysis.time_complexity).label}
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-xs text-slate-400 mb-1">Space Efficiency</div>
              <div className="text-lg font-bold text-white">
                {getComplexityRating(complexityAnalysis.space_complexity).label}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
