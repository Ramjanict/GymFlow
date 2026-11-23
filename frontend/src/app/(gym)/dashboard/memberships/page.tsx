'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import { CreditCard, Plus, CheckCircle, Users, X } from 'lucide-react';

export default function DashboardMembershipsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('3000');
  const [durationDays, setDurationDays] = useState('30');
  const [bookingLimit, setBookingLimit] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [planRes, branchRes] = await Promise.all([
      apiRequest('/memberships/plans'),
      apiRequest('/branches'),
    ]);
    if (planRes.success && planRes.data) setPlans(planRes.data);
    if (branchRes.success && branchRes.data) setBranches(branchRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleBranch = (bId: string) => {
    setSelectedBranches((prev) =>
      prev.includes(bId) ? prev.filter((id) => id !== bId) : [...prev, bId],
    );
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await apiRequest('/memberships/plans', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        durationDays: Number(durationDays),
        bookingLimit: bookingLimit ? Number(bookingLimit) : null,
        branchIds: selectedBranches,
      }),
    });

    setSubmitting(false);

    if (res.success) {
      toast.success('Membership plan created!');
      setModalOpen(false);
      setName('');
      setDescription('');
      loadData();
    } else {
      toast.error(res.error || 'Failed to create plan');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Membership Plans & Pricing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure monthly passes, VIP all-access memberships, and booking entitlements.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-xs shadow-sm transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Create Membership Tier</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary bg-orange-50 px-2.5 py-0.5 rounded">
                    {plan.durationDays} Days
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{plan._count?.subscriptions || 0} active</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    ৳{Number(plan.price).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">/ cycle</span>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    <span>
                      {plan.bookingLimit ? `Max ${plan.bookingLimit} classes` : 'Unlimited bookings'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    <span>
                      Access: {plan.branches?.length ? `${plan.branches.length} branches` : 'All'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Membership Plan</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quarterly Pro Pass"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Monthly Booking Limit (Optional)
                </label>
                <input
                  type="number"
                  value={bookingLimit}
                  onChange={(e) => setBookingLimit(e.target.value)}
                  placeholder="Leave empty for unlimited"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Eligible Branches
                </label>
                <div className="space-y-1.5">
                  {branches.map((b) => (
                    <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(b.id)}
                        onChange={() => toggleBranch(b.id)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-slate-700 font-medium">
                        {b.name} ({b.city})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-xs"
                >
                  {submitting ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
