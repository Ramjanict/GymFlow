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
  CheckSquare,
  LogOut,
  ChevronRight,
  ShieldCheck,
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
    { label: 'Branches & Rooms', href: '/dashboard/branches', icon: Building2 },
    { label: 'Recurring Schedules', href: '/dashboard/schedules', icon: Calendar },
    { label: 'Bookings & Waitlists', href: '/dashboard/bookings', icon: Users },
    { label: 'Membership Plans', href: '/dashboard/memberships', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-sidebar text-white flex flex-col justify-between shrink-0 shadow-2xl">
        <div>
          {/* Brand & Organization */}
          <div className="p-6 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                <Dumbbell className="h-5 w-5 rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Gym<span className="text-primary">Flow</span>
              </span>
            </Link>

            <div className="mt-4 p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Tenant
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {user?.organizationName || 'FitZone Global Fitness'}
                </div>
              </div>
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
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
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs border border-slate-700">
              {user?.firstName?.[0] || 'O'}
              {user?.lastName?.[0] || 'W'}
            </div>
            <div className="overflow-hidden text-xs">
              <div className="font-semibold text-white truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Alex Kareem'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user?.roles?.[0] || 'GYM_OWNER'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500">
            Tenant Boundary: <span className="text-slate-900 font-bold">FitZone (org_A)</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Public Website
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/member/classes"
              className="text-primary font-semibold hover:underline"
            >
              Member View
            </Link>
          </div>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
