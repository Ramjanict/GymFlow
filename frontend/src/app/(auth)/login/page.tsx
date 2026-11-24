'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Dumbbell,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Users,
  AlertCircle,
  Terminal,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverOffline, setServerOffline] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerOffline(false);

    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.success && res.data) {
      toast.success('Login successful!');
      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.tokens.accessToken,
        }),
      );

      // Route by role
      const roles = res.data.user.roles || [];
      if (roles.includes('SUPER_ADMIN')) {
        router.push('/admin');
      } else if (
        roles.includes('GYM_OWNER') ||
        roles.includes('GYM_ADMIN') ||
        roles.includes('BRANCH_MANAGER')
      ) {
        router.push('/dashboard/overview');
      } else if (roles.includes('TRAINER')) {
        router.push('/trainer');
      } else {
        router.push('/member/classes');
      }
    } else {
      if (res.error?.includes('Failed to fetch') || res.error?.includes('Network error')) {
        setServerOffline(true);
        toast.error('Cannot reach backend on port 4000');
      } else {
        toast.error(res.error || 'Invalid email or password');
      }
    }
  };

  const setDemoUser = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-mesh-dark relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[400px] h-[300px] bg-accent-violet/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-xl shadow-primary/30 group-hover:scale-105 transition-transform">
            <Dumbbell className="h-6 w-6 rotate-45" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-white">
            Gym<span className="text-gradient-primary">Flow</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-black text-white tracking-tight">
          Sign in to your portal
        </h2>
        <p className="mt-2 text-xs text-zinc-400">
          Or{' '}
          <Link href="/register" className="font-semibold text-primary hover:text-orange-400 transition-colors">
            register a new gym organization
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
          {/* Server Offline Alert Banner */}
          {serverOffline && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>Backend API Server Offline (Port 4000)</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                The frontend cannot reach <code className="text-zinc-200 bg-white/5 px-1 py-0.5 rounded">http://localhost:4000</code>.
                Start the backend in your terminal with:
              </p>
              <div className="p-2 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-amber-300 flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 shrink-0" />
                <span>cd backend &amp;&amp; npm run start:dev</span>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Email Address
              </label>
              <div className="mt-1.5 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. member@fitzone.com"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                <Mail className="h-4 w-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Password
              </label>
              <div className="mt-1.5 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 pl-10 pr-10 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                <Lock className="h-4 w-4 text-zinc-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 border border-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-6 border-t border-white/[0.08]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center mb-3">
              Quick Demo Logins (1-Click Fill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoUser('owner@fitzone.com', '123456')}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-primary/40 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                  <Dumbbell className="h-3.5 w-3.5" />
                  <span>Gym Owner</span>
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">owner@fitzone.com</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoUser('member@fitzone.com', '123456')}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <Users className="h-3.5 w-3.5" />
                  <span>Member</span>
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">member@fitzone.com</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoUser('trainer@fitzone.com', '123456')}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Trainer</span>
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">trainer@fitzone.com</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoUser('admin@gymflow.com', 'Admin12345!')}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-violet-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-violet-400 text-xs font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Super Admin</span>
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">admin@gymflow.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Live system pill */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Neon DB Connected &bull; JWT Token Rotation Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
