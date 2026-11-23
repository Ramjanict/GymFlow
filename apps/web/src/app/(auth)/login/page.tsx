'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import { Dumbbell, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      toast.error(res.error || 'Invalid email or password');
    }
  };

  const setDemoUser = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
            <Dumbbell className="h-6 w-6 rotate-45" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Gym<span className="text-primary">Flow</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
          Sign in to your portal
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          Or{' '}
          <Link href="/register" className="font-semibold text-primary hover:text-orange-600">
            register a new gym organization
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="mt-1.5 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. owner@fitzone.com"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1.5 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition-all disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* 1-Click Demo Shortcut Login buttons */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-3 text-center">
              Quick Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoUser('owner@fitzone.com', '123456')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 text-left transition-colors"
              >
                <div className="font-bold text-slate-800">Gym Owner</div>
                <div className="text-[10px] text-slate-500">owner@fitzone.com</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('trainer@fitzone.com', '123456')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-left transition-colors"
              >
                <div className="font-bold text-slate-800">Trainer</div>
                <div className="text-[10px] text-slate-500">trainer@fitzone.com</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('member@fitzone.com', '123456')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 text-left transition-colors"
              >
                <div className="font-bold text-slate-800">Member</div>
                <div className="text-[10px] text-slate-500">member@fitzone.com</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('admin@gymflow.com', 'Admin12345!')}
                className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-left transition-colors"
              >
                <div className="font-bold text-purple-900">Super Admin</div>
                <div className="text-[10px] text-purple-700">admin@gymflow.com</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
