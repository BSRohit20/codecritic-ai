'use client';

import { useState, useEffect } from 'react';
import { History, TrendingUp, Download, Trash2, Calendar } from 'lucide-react';
import { CodeReviewResult } from '@/app/page';

interface ReviewHistoryItem {
  id: string;
  timestamp: string;
  language: string;
  codeSnippet: string;
  result: CodeReviewResult;
}

export default function CodeHistory() {
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/api/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setHistory([]);
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `code-reviews-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAsPDF = () => {
    // Simple PDF export (in a real app, use a library like jsPDF)
    alert('PDF export would be implemented with a library like jsPDF or react-pdf');
  };

  const calculateAverageScore = () => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, item) => acc + item.result.overall_score, 0);
    return Math.round(sum / history.length);
  };

  const getScoreTrend = () => {
    if (history.length < 2) return 'neutral';
    const recent = history.slice(0, 5);
    const older = history.slice(5, 10);
    
    if (older.length === 0) return 'neutral';
    
    const recentAvg = recent.reduce((acc, item) => acc + item.result.overall_score, 0) / recent.length;
    const olderAvg = older.reduce((acc, item) => acc + item.result.overall_score, 0) / older.length;
    
    return recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
  };

  const trend = getScoreTrend();
  const avgScore = calculateAverageScore();
  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading history...</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-primary-400" />
            Code Review Analytics
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={exportAsJSON}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={exportAsPDF}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-sm rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Reviews */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Reviews</div>
            <div className="text-3xl font-bold text-white">{history.length}</div>
          </div>

          {/* Average Score */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Average Score</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white">{avgScore}</div>
              <div className="text-sm text-slate-400">/100</div>
            </div>
          </div>

          {/* Trend */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Trend</div>
            <div className="flex items-center gap-2">
              <TrendingUp 
                className={`w-6 h-6 ${
                  trend === 'improving' ? 'text-green-400' : 
                  trend === 'declining' ? 'text-red-400 rotate-180' : 
                  'text-yellow-400'
                }`} 
              />
              <span className={`text-lg font-semibold ${
                trend === 'improving' ? 'text-green-400' : 
                trend === 'declining' ? 'text-red-400' : 
                'text-yellow-400'
              }`}>
                {trend === 'improving' ? 'Improving' : 
                 trend === 'declining' ? 'Declining' : 
                 'Stable'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review History List */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h4 className="text-lg font-semibold text-white">Recent Reviews</h4>
        </div>
        
        <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No reviews yet. Start reviewing code to build your history!</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 hover:bg-slate-700/30 cursor-pointer transition-colors"
                onClick={() => setSelectedReview(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-primary-900/30 text-primary-300 text-xs rounded">
                        {item.language}
                      </span>
                      <span className="text-sm text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <pre className="text-sm text-slate-300 font-mono bg-slate-900/50 p-2 rounded overflow-x-auto">
                      {item.codeSnippet}
                    </pre>
                  </div>
                  <div className="ml-4">
                    <div className={`text-2xl font-bold ${
                      item.result.overall_score >= 80 ? 'text-green-400' :
                      item.result.overall_score >= 60 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {item.result.overall_score}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expose saveToHistory for parent component */}
      <input type="hidden" id="saveToHistory" />
    </div>
  );
}

// Export the saveToHistory function to be used by parent
export { type ReviewHistoryItem };
