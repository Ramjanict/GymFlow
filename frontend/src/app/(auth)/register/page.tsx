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
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [accountType, setAccountType] = useState<'GYM' | 'MEMBER'>('GYM');
  const [organizationName, setOrganizationName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      firstName,
      lastName,
      email,
      password,
      phone,
      ...(accountType === 'GYM'
        ? {
            organizationName,
            role: 'GYM_OWNER',
          }
        : {
            role: 'MEMBER',
          }),
    };

    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.success && res.data) {
      toast.success('Registration successful!');
      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.tokens.accessToken,
        }),
      );

      if (accountType === 'GYM') {
        router.push('/dashboard/overview');
      } else {
        router.push('/member/classes');
      }
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-mesh-dark relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

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
          Create your account
        </h2>
        <p className="mt-2 text-xs text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:text-orange-400 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          {/* Account type tab selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 rounded-2xl mb-6 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setAccountType('GYM')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                accountType === 'GYM'
                  ? 'bg-gradient-to-r from-primary to-orange-600 text-white shadow-md shadow-primary/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Gym Business</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('MEMBER')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                accountType === 'MEMBER'
                  ? 'bg-gradient-to-r from-primary to-orange-600 text-white shadow-md shadow-primary/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Gym Member</span>
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {accountType === 'GYM' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Gym Business Name
                </label>
                <div className="mt-1.5 relative">
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Iron Forge Fitness"
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <Building2 className="h-4 w-4 text-zinc-500 absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="mt-1.5 w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="mt-1.5 w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

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
                  placeholder="you@example.com"
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
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                <Lock className="h-4 w-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Phone Number <span className="text-zinc-500 text-[10px] lowercase">(optional)</span>
              </label>
              <div className="mt-1.5 relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711 000000"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                <Phone className="h-4 w-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 border border-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {accountType === 'GYM' && (
            <div className="mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Multi-Tenant Isolation Guaranteed</span>
              </div>
              <p>Your gym gets an isolated tenant schema with custom branches, rooms, and staff access.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
