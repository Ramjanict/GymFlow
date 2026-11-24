'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import {
  Dumbbell,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Calendar,
  ChevronDown,
  Sparkles,
  Zap,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-dark-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-dark-950/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
            <Dumbbell className="h-5 w-5 rotate-45" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              Gym<span className="text-gradient-primary">Flow</span>
            </span>
            <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest -mt-1 flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
              Multi-Tenant SaaS
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <Link href="/#classes" className="hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider">
            Classes
          </Link>
          <Link href="/#schedule" className="hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider">
            Schedules
          </Link>
          <Link href="/#trainers" className="hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider">
            Trainers
          </Link>
          <Link href="/#pricing" className="hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider">
            Memberships
          </Link>

          {/* Quick Portal Switcher */}
          <div className="relative">
            <button
              onClick={() => setPortalMenuOpen(!portalMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-zinc-200 hover:bg-white/[0.1] hover:border-primary/40 text-xs font-semibold tracking-wide transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Portals</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {portalMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-64 rounded-2xl glass-panel p-2 shadow-2xl border border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setPortalMenuOpen(false)}
              >
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Enterprise Workspaces
                </div>
                <Link
                  href="/member/classes"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-zinc-200 hover:bg-white/[0.08] hover:text-white transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Member Portal</div>
                    <div className="text-[11px] text-zinc-400">Class booking & schedules</div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/overview"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-zinc-200 hover:bg-white/[0.08] hover:text-white transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Gym Dashboard</div>
                    <div className="text-[11px] text-zinc-400">Owner & staff operations</div>
                  </div>
                </Link>
                <Link
                  href="/trainer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-zinc-200 hover:bg-white/[0.08] hover:text-white transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Trainer Portal</div>
                    <div className="text-[11px] text-zinc-400">Assigned classes & roster</div>
                  </div>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-zinc-200 hover:bg-white/[0.08] hover:text-white transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Super Admin</div>
                    <div className="text-[11px] text-zinc-400">Platform SaaS tenants</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-white/[0.06] transition-all border border-white/[0.06]"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-semibold text-zinc-100">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-medium">{user.roles[0] || 'User'}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl border border-white/10 z-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/[0.08]">
                    <p className="text-xs font-semibold text-white">{user.email}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">{user.roles.join(', ')}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-orange-600 rounded-xl shadow-lg shadow-primary/25 border border-primary/40 transition-all hover:scale-[1.02]"
              >
                Register Gym
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/[0.08] px-4 py-4 space-y-3">
          <Link href="/#classes" className="block text-sm text-zinc-300 hover:text-primary py-1">Classes</Link>
          <Link href="/#schedule" className="block text-sm text-zinc-300 hover:text-primary py-1">Schedules</Link>
          <Link href="/#pricing" className="block text-sm text-zinc-300 hover:text-primary py-1">Memberships</Link>
          <div className="border-t border-white/[0.08] pt-3 space-y-2">
            <Link href="/member/classes" className="block text-xs text-emerald-400 font-semibold py-1">Member Portal</Link>
            <Link href="/dashboard/overview" className="block text-xs text-primary font-semibold py-1">Gym Dashboard</Link>
            <Link href="/trainer" className="block text-xs text-cyan-400 font-semibold py-1">Trainer Portal</Link>
            <Link href="/admin" className="block text-xs text-violet-400 font-semibold py-1">Super Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}
