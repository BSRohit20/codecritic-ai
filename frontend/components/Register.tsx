'use client';

import { useState, useRef } from 'react';
import { UserPlus, Mail, Lock, User, Code2, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const captchaToken = recaptchaRef.current?.getValue() || 'dummy-captcha-token';
      await register(email, password, name, captchaToken);
      setSuccess('Registration successful! Please check your email to verify your account.');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Centered 2-Column Container */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-10">
        
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center p-8 xl:p-12">
        
        {/* Logo and Tagline */}
        <div className="relative z-10 text-center max-w-xl">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl shadow-blue-500/50 animate-pulse">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">CodeCritic AI</h1>
              <p className="text-blue-200 text-sm font-medium mt-1">Intelligent Code Review Platform</p>
            </div>
          </div>
          
          <div className="mt-16 space-y-8">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center gap-4 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border border-blue-500/20">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Instant Code Analysis</h3>
                  <p className="text-blue-100 text-lg">Get comprehensive code reviews in seconds with detailed insights on bugs, security, and performance.</p>
                </div>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center gap-4 p-6 bg-gradient-to-r from-cyan-500/10 to-sky-500/10 backdrop-blur-sm rounded-2xl border border-cyan-500/20">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl shadow-lg group-hover:shadow-cyan-500/50 transition-shadow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Security First</h3>
                  <p className="text-blue-100 text-lg">Detect vulnerabilities and security issues before they make it to production.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 flex justify-center items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-sky-500 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 border-2 border-white"></div>
            </div>
            <p className="text-blue-200 text-sm font-medium">
              Join <span className="text-white font-bold">10,000+</span> developers worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full space-y-6 relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl shadow-blue-500/50">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
                CodeCritic AI
              </h1>
            </div>
            <p className="text-blue-300 text-sm">Intelligent Code Review Platform</p>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p className="text-blue-300 text-lg">Start reviewing your code with AI</p>
          </div>

          {/* Register Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-blue-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-blue-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-blue-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-blue-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-blue-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 text-green-300 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">{success}</p>
                    <p className="text-xs text-green-400">Check your spam folder if you don't see it in your inbox.</p>
                  </div>
                </div>
              </div>
            )}

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                theme="dark"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 hover:from-blue-500 hover:via-cyan-500 hover:to-sky-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-blue-300 text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
          </div>
        </div>
      </div>
      
      </div>
      </div>
    </div>
  );
}
