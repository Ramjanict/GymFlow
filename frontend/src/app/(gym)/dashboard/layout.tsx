'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import {
  Dumbbell,
  LayoutDashboard,
  Building2,
  Calendar,
  Users,
  CreditCard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
    { label: 'Classes & Programs', href: '/dashboard/classes', icon: Dumbbell },
    { label: 'Branches & Studios', href: '/dashboard/branches', icon: Building2 },
    { label: 'Recurring Schedules', href: '/dashboard/schedules', icon: Calendar },
    { label: 'Bookings & Waitlists', href: '/dashboard/bookings', icon: Users },
    { label: 'Membership Plans', href: '/dashboard/memberships', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex bg-dark-950 text-zinc-100 font-sans selection:bg-primary selection:text-white">
      {/* Sleek Dark Sidebar */}
      <aside className="w-64 bg-dark-950/90 border-r border-white/[0.08] flex flex-col justify-between shrink-0 shadow-2xl relative z-20">
        <div>
          {/* Brand & Active Organization */}
          <div className="p-6 border-b border-white/[0.08]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <Dumbbell className="h-5 w-5 rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">
                  Gym<span className="text-gradient-primary">Flow</span>
                </span>
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest -mt-1">
                  Tenant Workspace
                </span>
              </div>
            </Link>

            {/* Tenant Chip */}
            <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="overflow-hidden">
                <div className="text-[9px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                  Active Tenant
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {user?.organizationName || 'FitZone Global Fitness'}
                </div>
              </div>
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Operations Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/25 border border-primary/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/[0.08] space-y-3 bg-white/[0.01]">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {user?.firstName?.[0] || 'O'}
              {user?.lastName?.[0] || 'W'}
            </div>
            <div className="overflow-hidden text-xs">
              <div className="font-semibold text-white truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Alex Kareem'}
              </div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider truncate">
                {user?.roles?.[0] || 'GYM_OWNER'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 text-xs font-semibold border border-white/[0.06] hover:border-rose-500/20 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        {/* Top bar */}
        <header className="h-16 border-b border-white/[0.08] bg-dark-950/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tenant Boundary:</span>
            <strong className="text-white bg-white/[0.05] px-2 py-0.5 rounded-md border border-white/[0.08]">
              FitZone (org_A)
            </strong>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Public Website</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/member/classes"
              className="text-primary hover:text-orange-400 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Member View</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <main className="p-8 flex-1 bg-radial-hero">{children}</main>
      </div>
    </div>
  );
}
