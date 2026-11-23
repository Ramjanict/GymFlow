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
  ShieldAlert,
  Calendar,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-md shadow-primary/20">
            <Dumbbell className="h-5 w-5 rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Gym<span className="text-primary">Flow</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider -mt-1">
              Multi-Tenant SaaS
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link href="/#classes" className="hover:text-primary transition-colors">
            Classes
          </Link>
          <Link href="/#schedule" className="hover:text-primary transition-colors">
            Schedule
          </Link>
          <Link href="/#trainers" className="hover:text-primary transition-colors">
            Trainers
          </Link>
          <Link href="/#pricing" className="hover:text-primary transition-colors">
            Memberships
          </Link>

          {/* Quick Portal Switcher */}
          <div className="relative">
            <button
              onClick={() => setPortalMenuOpen(!portalMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-semibold tracking-wide transition-colors"
            >
              <span>Portals</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {portalMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setPortalMenuOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Workspace Portal
                </div>
                <Link
                  href="/member/classes"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <div>
                    <div className="font-medium">Member Portal</div>
                    <div className="text-xs text-slate-400">Class booking & schedule</div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/overview"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Gym Dashboard</div>
                    <div className="text-xs text-slate-400">Owner & staff operations</div>
                  </div>
                </Link>
                <Link
                  href="/trainer"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Dumbbell className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Trainer Portal</div>
                    <div className="text-xs text-slate-400">Assigned classes & check-in</div>
                  </div>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ShieldAlert className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="font-medium">Super Admin</div>
                    <div className="text-xs text-slate-400">Platform SaaS tenants</div>
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
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-semibold text-slate-800">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-slate-400">{user.roles[0] || 'User'}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-1.5 shadow-xl border border-slate-100 z-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{user.email}</p>
                    <p className="text-[11px] text-slate-500 capitalize">{user.roles.join(', ')}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
              >
                Register Gym
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
