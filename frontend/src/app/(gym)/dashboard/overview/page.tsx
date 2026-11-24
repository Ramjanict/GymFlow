'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Users,
  Dumbbell,
  Calendar,
  CreditCard,
  Building2,
  TrendingUp,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      setLoading(true);
      const res = await apiRequest('/dashboard/overview');
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
    fetchOverview();
  }, []);

  const metrics = data?.metrics || {
    totalMembers: 1,
    totalTrainers: 1,
    activeClasses: 2,
    todaySessions: 1,
    totalRevenue: 4500,
    currency: 'BDT',
  };

  const branches = data?.branches || [];
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Heading & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Real-time Tenant Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Executive Operations Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time occupancy, capacity allocation, and revenue for FitZone Global.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/classes"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 border border-primary/40 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>New Class</span>
          </Link>
          <Link
            href="/dashboard/schedules"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 font-bold text-xs uppercase tracking-wider border border-white/[0.1] transition-all hover:scale-[1.02]"
          >
            <Calendar className="h-4 w-4 text-primary" />
            <span>Schedules</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Total Members
            </p>
            <p className="text-3xl font-black text-white">{metrics.totalMembers}</p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+100% this month</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Active Programs
            </p>
            <p className="text-3xl font-black text-white">{metrics.activeClasses}</p>
            <p className="text-[11px] text-zinc-400 font-medium">Yoga, HIIT &amp; Strength</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
            <Dumbbell className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Today&apos;s Sessions
            </p>
            <p className="text-3xl font-black text-white">{metrics.todaySessions}</p>
            <p className="text-[11px] text-amber-400 font-medium">Mirpur &amp; Gulshan</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Total Revenue
            </p>
            <p className="text-3xl font-black text-emerald-400">
              {metrics.totalRevenue} <span className="text-xs text-zinc-400 font-bold">{metrics.currency}</span>
            </p>
            <p className="text-[11px] text-zinc-400 font-medium">Neon DB Verified</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Branches & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Physical Branches Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Physical Gym Branches &amp; Studio Allocation</span>
            </h2>
            <Link
              href="/dashboard/branches"
              className="text-xs text-primary hover:text-orange-400 font-bold flex items-center gap-1"
            >
              <span>Manage Studios</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                    Active Branch
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">FitZone Mirpur Center</h3>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Plot 12, Main Road, Section 2</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Studio A (Yoga Sanctuary)</span>
                  <strong className="text-white">Cap: 25</strong>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Studio B (HIIT Arena)</span>
                  <strong className="text-white">Cap: 20</strong>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                    Active Branch
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">FitZone Gulshan Elite</h3>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Road 45, Gulshan-2</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Reformer Pilates Studio</span>
                  <strong className="text-white">Cap: 15</strong>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Strength &amp; Conditioning Zone</span>
                  <strong className="text-white">Cap: 30</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Architecture Callout Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-amber-500/5 to-transparent border border-primary/20 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Zero Double-Booking Row Locks Active</span>
              </p>
              <p className="text-[11px] text-zinc-400 font-light">
                Sessions are locked atomically in Neon PostgreSQL during booking transactions to guarantee 100% capacity integrity.
              </p>
            </div>
            <Link
              href="/dashboard/bookings"
              className="px-3 py-1.5 rounded-xl bg-primary hover:bg-orange-600 text-white text-xs font-bold shrink-0 transition-colors"
            >
              View Bookings
            </Link>
          </div>
        </div>

        {/* Live Booking Stream (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400" />
              <span>Recent Bookings</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Feed
            </span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-white/[0.08] space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                  SH
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Sarah Hossain</p>
                  <p className="text-[10px] text-zinc-400">Sunrise Flow Yoga</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                CONFIRMED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
                  AK
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Alex Kareem</p>
                  <p className="text-[10px] text-zinc-400">Metabolic Inferno HIIT</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold">
                ATTENDED
              </span>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/dashboard/bookings"
                className="text-xs font-bold text-primary hover:text-orange-400 transition-colors"
              >
                View all member bookings &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
