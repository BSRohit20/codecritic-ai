'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, X, Loader2 } from 'lucide-react';
import { CodeReviewResult } from '@/app/page';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  reviewResult: CodeReviewResult | null;
  originalCode: string;
  language: string;
}

export default function ChatAssistant({ reviewResult, originalCode, language }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with a welcome message when review is available
    if (reviewResult && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Hi! I'm your AI code review assistant. I've analyzed your ${language} code and found a quality score of ${reviewResult.overall_score}/100. Feel free to ask me questions about:

• Specific bugs or issues I found
• Security concerns and how to fix them
• Performance optimization strategies
• Refactoring suggestions
• Best practices for your code

What would you like to know?`,
        timestamp: new Date()
      }]);
    }
  }, [reviewResult, language]);

  const handleSend = async () => {
    if (!input.trim() || !reviewResult) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          code: originalCode,
          language: language,
          review_context: reviewResult,
          chat_history: messages.slice(-6) // Last 6 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "How can I fix the security issues?",
    "Explain the performance optimizations",
    "What are the most critical bugs?",
    "Show me better alternatives for this code"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && reviewResult && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full shadow-lg transition-all hover:scale-110 z-50 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded shadow-lg whitespace-nowrap">
              Ask questions about your review
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary-900/30 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <h3 className="font-semibold text-white">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-50 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 rounded-lg px-4 py-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && !loading && (
            <div className="px-4 pb-2 space-y-2">
              <p className="text-xs text-slate-400 mb-2">Suggested questions:</p>
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="w-full text-left text-xs px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your code review..."
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
