'use client';

import { useState } from 'react';
import { Share2, Users, MessageSquare, Copy, Check, Link as LinkIcon, Mail } from 'lucide-react';
import { CodeReviewResult } from '@/app/page';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  line?: number;
}

interface CollaborationProps {
  code: string;
  language: string;
  reviewResult: CodeReviewResult | null;
}

export default function Collaboration({ code, language, reviewResult }: CollaborationProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLine, setCommentLine] = useState<number | undefined>();
  const [authorName, setAuthorName] = useState('');
  const [copied, setCopied] = useState(false);

  const generateShareLink = () => {
    // Create a shareable link with encoded data
    const shareData = {
      code,
      language,
      result: reviewResult,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, you'd upload this to a server and get a short URL
    const encoded = btoa(JSON.stringify(shareData));
    const shareUrl = `${window.location.origin}/shared/${encoded.substring(0, 12)}`;
    return shareUrl;
  };

  const copyShareLink = async () => {
    const link = generateShareLink();
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const link = generateShareLink();
    const subject = encodeURIComponent(`Code Review: ${language}`);
    const body = encodeURIComponent(`Check out this code review:\n\n${link}\n\nScore: ${reviewResult?.overall_score}/100`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const addComment = () => {
    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName,
      text: newComment,
      timestamp: new Date().toISOString(),
      line: commentLine
    };

    setComments([...comments, comment]);
    setNewComment('');
    setCommentLine(undefined);
    
    // Save to localStorage
    localStorage.setItem('reviewComments', JSON.stringify([...comments, comment]));
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsShareOpen(!isShareOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
        disabled={!reviewResult}
      >
        <Share2 className="w-4 h-4" />
        Share & Collaborate
      </button>

      {/* Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Share & Collaborate</h2>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Share Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Share This Review</h3>
                
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={generateShareLink()}
                        readOnly
                        className="w-full px-3 py-2 bg-slate-800 text-slate-300 rounded border border-slate-600 text-sm"
                      />
                    </div>
                    <button
                      onClick={copyShareLink}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={shareViaEmail}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Share via Email
                  </button>
                </div>

                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    <strong>Note:</strong> Share links are generated client-side. For production use, 
                    implement server-side storage for permanent links and real-time collaboration.
                  </p>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  Team Comments ({comments.length})
                </h3>

                {/* Add Comment */}
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600"
                  />
                  
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={commentLine || ''}
                      onChange={(e) => setCommentLine(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Line # (optional)"
                      className="w-24 px-3 py-2 bg-slate-800 text-white rounded border border-slate-600"
                    />
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment or question..."
                      className="flex-1 px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 resize-none"
                      rows={2}
                    />
                  </div>

                  <button
                    onClick={addComment}
                    disabled={!newComment.trim() || !authorName.trim()}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Comment
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No comments yet. Start the conversation!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-slate-700/30 border border-slate-600 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {comment.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{comment.author}</div>
                              <div className="text-xs text-slate-400">
                                {new Date(comment.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          {comment.line && (
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                              Line {comment.line}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-200 text-sm">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Team Workspace Info */}
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-purple-300 mb-2">🚀 Team Workspace (Coming Soon)</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Real-time collaborative editing</li>
                  <li>• Persistent review history for teams</li>
                  <li>• Code review workflows and approvals</li>
                  <li>• Integration with GitHub, GitLab, Bitbucket</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
