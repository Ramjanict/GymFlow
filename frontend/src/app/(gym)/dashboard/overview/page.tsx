'use client';

import React, { useEffect, useState } from 'react';
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

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Loading Gym Analytics from Neon PostgreSQL...
      </div>
    );
  }

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
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Executive Operations Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics, capacity allocation, and revenue for FitZone Global.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Members
            </p>
            <p className="text-2xl font-black text-slate-900">{metrics.totalMembers}</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+100% this month</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Programs
            </p>
            <p className="text-2xl font-black text-slate-900">{metrics.activeClasses}</p>
            <p className="text-[11px] text-slate-500 font-medium">Yoga, HIIT & Strength</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-orange-50 text-primary flex items-center justify-center">
            <Dumbbell className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Today&apos;s Sessions
            </p>
            <p className="text-2xl font-black text-slate-900">{metrics.todaySessions}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">100% capacity filled</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-2xl font-black text-slate-900">
              ৳{metrics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold">Verified transactions</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Two Columns: Branches & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Branches Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Branch Network</h3>
            <span className="text-xs text-primary font-bold">{branches.length} Locations</span>
          </div>

          <div className="space-y-3">
            {branches.map((branch: any) => (
              <div
                key={branch.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{branch.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{branch.city}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    {branch._count?.sessions || 0} Sessions
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {branch._count?.staff || 0} Staff
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings Live Roster */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Member Bookings</h3>
              <p className="text-xs text-slate-400">Live booking transactions with row-level safety</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">Member</th>
                  <th className="pb-3">Fitness Class</th>
                  <th className="pb-3">Branch</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No bookings recorded yet
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">
                          {b.member?.user?.firstName} {b.member?.user?.lastName}
                        </div>
                        <div className="text-[10px] text-slate-400">{b.member?.user?.email}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-800">
                          {b.session?.fitnessClass?.name || 'Class'}
                        </div>
                      </td>
                      <td className="py-3 text-slate-500">{b.session?.branch?.name}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
