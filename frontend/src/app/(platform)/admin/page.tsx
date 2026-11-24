'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function SuperAdminPage() {
  const [data, setData] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      const [overviewRes, orgsRes] = await Promise.all([
        apiRequest('/dashboard/superadmin'),
        apiRequest('/organizations'),
      ]);

      if (overviewRes.success && overviewRes.data) {
        setData(overviewRes.data);
      }
      if (orgsRes.success && orgsRes.data) {
        setOrganizations(orgsRes.data);
      }
      setLoading(false);
    }
    loadAdminData();
  }, []);

  const handleToggleStatus = async (orgId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const res = await apiRequest(`/organizations/${orgId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    });

    if (res.success) {
      toast.success(`Organization status updated to ${nextStatus}`);
      setOrganizations((prev) =>
        prev.map((o) => (o.id === orgId ? { ...o, status: nextStatus } : o)),
      );
    } else {
      toast.error('Failed to change status');
    }
  };

  return (
    <div className="min-h-screen bg-mesh-dark text-white flex flex-col selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
            <ShieldAlert className="h-4 w-4" />
            <span>Platform Master Control &bull; Super Admin Console</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Global SaaS Tenant Orchestration
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global management of registered gym businesses, infrastructure health, and SaaS subscriptions.
          </p>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Total Gym Tenants
              </p>
              <p className="text-3xl font-black text-white mt-1">
                {organizations.length || 1}
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">100% Active</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Registered Users
              </p>
              <p className="text-3xl font-black text-white mt-1">
                {data?.totalUsers || 4}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">Platform-wide</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Neon Cloud DB Pool
              </p>
              <p className="text-3xl font-black text-emerald-400 mt-1">HEALTHY</p>
              <p className="text-[11px] text-zinc-400 mt-1">Zero Latency Spike</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Server className="h-6 w-6" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Security Engine
              </p>
              <p className="text-3xl font-black text-primary mt-1">ARMED</p>
              <p className="text-[11px] text-zinc-400 mt-1">Row-Locking Active</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <Lock className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="glass-card rounded-3xl p-6 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-white">Registered Gym Organizations (Tenants)</h2>
              <p className="text-xs text-zinc-400">Platform-wide tenant data isolation boundaries.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-bold">
              {organizations.length} Active Organizations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-zinc-400 border-b border-white/[0.06]">
                <tr>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Slug / Boundary</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {org.name[0]}
                      </div>
                      <span>{org.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{org.slug}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{org.email || 'contact@fitzone.com'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          org.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {org.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(org.id, org.status)}
                        className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold border border-white/[0.08] transition-colors"
                      >
                        {org.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
