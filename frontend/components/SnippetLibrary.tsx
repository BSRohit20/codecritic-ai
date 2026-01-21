'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Trash2, Tag, Copy, Check, Star } from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  description: string;
  fixes: string;
  usageCount: number;
  createdAt: string;
  isFavorite: boolean;
}

export default function SnippetLibrary() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>('all');

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = () => {
    const stored = localStorage.getItem('codeSnippets');
    if (stored) {
      setSnippets(JSON.parse(stored));
    }
  };

  const saveSnippet = (snippet: Omit<CodeSnippet, 'id' | 'usageCount' | 'createdAt'>) => {
    const newSnippet: CodeSnippet = {
      ...snippet,
      id: Date.now().toString(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [newSnippet, ...snippets];
    setSnippets(updated);
    localStorage.setItem('codeSnippets', JSON.stringify(updated));
  };

  const deleteSnippet = (id: string) => {
    if (confirm('Delete this snippet?')) {
      const updated = snippets.filter(s => s.id !== id);
      setSnippets(updated);
      localStorage.setItem('codeSnippets', JSON.stringify(updated));
    }
  };

  const toggleFavorite = (id: string) => {
    const updated = snippets.map(s => 
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    );
    setSnippets(updated);
    localStorage.setItem('codeSnippets', JSON.stringify(updated));
  };

  const incrementUsage = (id: string) => {
    const updated = snippets.map(s => 
      s.id === id ? { ...s, usageCount: s.usageCount + 1 } : s
    );
    setSnippets(updated);
    localStorage.setItem('codeSnippets', JSON.stringify(updated));
  };

  const copySnippet = async (snippet: CodeSnippet) => {
    await navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    incrementUsage(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getAllTags = () => {
    const tagSet = new Set<string>();
    snippets.forEach(s => s.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = searchQuery === '' || 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = filterTag === 'all' || snippet.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  const sortedSnippets = [...filteredSnippets].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.usageCount - a.usageCount;
  });

  // Auto-suggest based on current code patterns
  const suggestSnippets = (code: string, language: string) => {
    return snippets
      .filter(s => s.language === language)
      .filter(s => {
        // Simple pattern matching
        const codeWords = code.toLowerCase().split(/\W+/);
        const snippetWords = s.description.toLowerCase().split(/\W+/);
        return snippetWords.some(word => codeWords.includes(word));
      })
      .slice(0, 3);
  };

  return (
    <>
      {/* Library Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        Snippet Library ({snippets.length})
      </button>

      {/* Library Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Code Snippet Library</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Search and Filters */}
            <div className="px-6 py-4 border-b border-slate-700 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search snippets..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Snippet title:');
                    const description = prompt('Description:');
                    const tags = prompt('Tags (comma-separated):')?.split(',').map(t => t.trim()) || [];
                    if (title && description) {
                      saveSnippet({
                        title,
                        description,
                        code: '// Add your code here',
                        language: 'javascript',
                        tags,
                        fixes: '',
                        isFavorite: false
                      });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Snippet
                </button>
              </div>

              {/* Tag Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400" />
                <button
                  onClick={() => setFilterTag('all')}
                  className={`px-3 py-1 text-sm rounded ${
                    filterTag === 'all' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All
                </button>
                {getAllTags().map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-1 text-sm rounded ${
                      filterTag === tag 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Snippets List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {sortedSnippets.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No snippets found</p>
                  <p className="text-sm">Start building your code pattern library!</p>
                </div>
              ) : (
                sortedSnippets.map(snippet => (
                  <div
                    key={snippet.id}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{snippet.title}</h3>
                          {snippet.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                          <span className="text-xs text-slate-400">
                            Used {snippet.usageCount} times
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{snippet.description}</p>
                        <div className="flex items-center gap-2">
                          {snippet.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                            {snippet.language}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(snippet.id)}
                          className="p-2 hover:bg-slate-600 rounded transition-colors"
                          title="Toggle favorite"
                        >
                          <Star className={`w-4 h-4 ${snippet.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'}`} />
                        </button>
                        <button
                          onClick={() => copySnippet(snippet)}
                          className="p-2 hover:bg-slate-600 rounded transition-colors"
                          title="Copy code"
                        >
                          {copiedId === snippet.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteSnippet(snippet.id)}
                          className="p-2 hover:bg-red-900/30 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    
                    <pre className="bg-slate-900/50 p-3 rounded text-sm overflow-x-auto">
                      <code className="text-slate-300">{snippet.code}</code>
                    </pre>

                    {snippet.fixes && (
                      <div className="mt-3 p-3 bg-green-900/20 border border-green-700/30 rounded">
                        <p className="text-sm text-green-300">
                          <strong>Fixes:</strong> {snippet.fixes}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Export function to save from review results
export const saveSnippetFromReview = (
  code: string,
  language: string,
  description: string,
  fixes: string,
  tags: string[]
) => {
  const snippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
  const newSnippet: CodeSnippet = {
    id: Date.now().toString(),
    title: `${language} - ${description.substring(0, 50)}`,
    code,
    language,
    tags,
    description,
    fixes,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    isFavorite: false
  };
  
  snippets.unshift(newSnippet);
  localStorage.setItem('codeSnippets', JSON.stringify(snippets));
};
