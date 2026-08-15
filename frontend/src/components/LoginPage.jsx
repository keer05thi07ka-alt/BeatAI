import React, { useState } from 'react';
import Logo from './Logo';
import { api } from '../api';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle, UserPlus, LogIn } from 'lucide-react';

const LoginPage = ({ onLoginSuccess, onNavigateHome }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [fullName, setFullName] = useState('Sarah Smith');
  const [email, setEmail] = useState('sarah.smith@example.com');
  const [password, setPassword] = useState('password123');
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const user = await api.login(email.trim(), password);
        onLoginSuccess(user);
      } else {
        const user = await api.register(fullName.trim(), email.trim(), password);
        onLoginSuccess(user);
      }
    } catch (err) {
      console.warn("Auth error:", err);
      // Display exact error message from backend
      setAuthError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const user = await api.login('demo@beat.health', 'password123');
      onLoginSuccess(user);
    } catch (err) {
      onLoginSuccess({
        name: 'Alex Morgan',
        email: 'demo@beat.health',
        patientId: 'PAT-8921',
        initials: 'AM',
        isDemo: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="beat-container max-w-4xl">
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Side Branding */}
          <div className="bg-gradient-to-br from-[#0B1F33] via-[#0B1F33] to-[#1687E8] p-8 sm:p-12 text-white flex flex-col justify-between space-y-8">
            <div>
              <button onClick={onNavigateHome} className="focus:outline-hidden cursor-pointer">
                <Logo size="medium" />
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {authMode === 'login' ? "Welcome Back to Beat" : "Join Beat Today"}
              </h2>
              <p className="text-sky-100 text-xs sm:text-sm font-medium leading-relaxed">
                Your personal AI healthcare companion for medical report analysis, timeline tracking, and context-aware insights.
              </p>
            </div>

            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15 text-xs text-slate-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#42C7E8] shrink-0" />
              <span>Verified patient authentication & strict multi-tenant account data privacy.</span>
            </div>
          </div>

          {/* Right Side Login / Registration Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
            
            {/* Mode Switcher Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-extrabold text-[#0B1F33]">
                  {authMode === 'login' ? "Patient Sign In" : "Create Patient Account"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {authMode === 'login' ? "Sign in with your verified email account" : "Register your email to start your private record"}
                </p>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'login' ? 'bg-white text-[#1687E8] shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup' ? 'bg-[#1687E8] text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Error Notification Alert */}
            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs space-y-2 animate-fade-in">
                <div className="flex items-start gap-2.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
                {authError.includes("not registered") && authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                    className="text-xs font-extrabold text-[#1687E8] hover:underline cursor-pointer flex items-center gap-1 pt-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Click here to create a new account
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name (Sign Up Mode) */}
              {authMode === 'signup' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-hidden focus:border-[#1687E8]"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-hidden focus:border-[#1687E8]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-hidden focus:border-[#1687E8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="beat-btn-primary w-full justify-center text-sm py-3 cursor-pointer mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : authMode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Your Account</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account & Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-xs text-slate-400 font-semibold absolute">OR QUICK DEMO</span>
            </div>

            <button
              onClick={handleQuickDemo}
              disabled={isLoading}
              className="w-full bg-sky-50 hover:bg-sky-100 text-[#1687E8] font-bold text-xs py-3 rounded-xl border border-sky-200 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#1687E8]" />
              <span>Log In with Alex Morgan (Pre-registered Demo Account)</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
