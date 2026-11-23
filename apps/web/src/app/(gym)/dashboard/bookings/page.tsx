'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import { Users, CheckCircle2, XCircle, Calendar, Clock, MapPin } from 'lucide-react';

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    const res = await apiRequest('/bookings/gym');
    if (res.success && res.data) {
      setBookings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCheckIn = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    const res = await apiRequest('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });
    setActionLoadingId(null);

    if (res.success) {
      toast.success('Member checked in successfully!');
      loadBookings();
    } else {
      toast.error(res.error || 'Check-in failed');
    }
  };

  const handleNoShow = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    const res = await apiRequest(`/attendance/${bookingId}/no-show`, {
      method: 'PATCH',
    });
    setActionLoadingId(null);

    if (res.success) {
      toast.warning('Marked as absent/no-show');
      loadBookings();
    } else {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Bookings & Attendance Console
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perform member check-ins, verify attendance, and monitor class occupancy.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No bookings recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Member</th>
                  <th className="py-3 px-5">Class & Schedule</th>
                  <th className="py-3 px-5">Branch</th>
                  <th className="py-3 px-5">Booking Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => {
                  const startsAt = new Date(b.session?.startsAt);
                  const isConfirmed = b.status === 'CONFIRMED';
                  const isAttended = b.status === 'ATTENDED';

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900">
                          {b.member?.user?.firstName} {b.member?.user?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{b.member?.user?.email}</div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800">
                          {b.session?.fitnessClass?.name || 'Class'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>
                            {startsAt.toLocaleDateString([], { month: 'short', day: 'numeric' })},{' '}
                            {startsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{b.session?.branch?.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                            isConfirmed
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : isAttended
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        {isConfirmed ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleCheckIn(b.id)}
                              disabled={actionLoadingId === b.id}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Check-In</span>
                            </button>
                            <button
                              onClick={() => handleNoShow(b.id)}
                              disabled={actionLoadingId === b.id}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors"
                            >
                              No-Show
                            </button>
                          </div>
                        ) : isAttended ? (
                          <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Checked In</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
