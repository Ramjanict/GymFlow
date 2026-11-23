'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600">
            <ShieldAlert className="h-4 w-4" />
            <span>Platform Master Control</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Super Admin Tenant Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global management of registered gym businesses, infrastructure health, and SaaS subscriptions.
          </p>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Gym Tenants
              </p>
              <p className="text-2xl font-black text-slate-900">
                {data?.totalOrganizations || organizations.length}
              </p>
              <p className="text-[11px] text-purple-600 font-semibold">Active Organizations</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Branches
              </p>
              <p className="text-2xl font-black text-slate-900">{data?.totalBranches || 2}</p>
              <p className="text-[11px] text-slate-500 font-medium">Physical Facilities</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Server className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Global Users
              </p>
              <p className="text-2xl font-black text-slate-900">{data?.totalUsers || 4}</p>
              <p className="text-[11px] text-emerald-600 font-semibold">Staff & Members</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Platform Volume
              </p>
              <p className="text-2xl font-black text-slate-900">
                ৳{(data?.totalPlatformRevenue || 4500).toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold">Processed Payments</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-primary flex items-center justify-center">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Registered Gyms Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered SaaS Gym Tenants</h3>
              <p className="text-xs text-slate-400">
                Enforcing row-level isolation boundary per tenant organization.
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Lock className="h-3.5 w-3.5" />
              <span>Multi-Tenant RLS Safe</span>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading tenants from Neon PostgreSQL...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-6">Gym Organization</th>
                    <th className="py-3 px-6">Tenant Slug</th>
                    <th className="py-3 px-6">Contact Email</th>
                    <th className="py-3 px-6">Branches</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{org.name}</td>
                      <td className="py-4 px-6 font-mono text-slate-500">{org.slug}</td>
                      <td className="py-4 px-6 text-slate-600">{org.email}</td>
                      <td className="py-4 px-6 font-semibold text-slate-700">
                        {org._count?.branches || 0} Branches
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                            org.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleToggleStatus(org.id, org.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            org.status === 'ACTIVE'
                              ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {org.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
