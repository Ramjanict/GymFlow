'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  CheckCircle,
  CreditCard,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

export default function MemberBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [bookingsRes, subRes] = await Promise.all([
      apiRequest('/bookings/my'),
      apiRequest('/memberships/my-subscription'),
    ]);

    if (bookingsRes.success && bookingsRes.data) {
      setBookings(bookingsRes.data);
    }
    if (subRes.success && subRes.data) {
      setSubscription(subRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? If there is a waitlist, the next member will be promoted.')) {
      return;
    }

    setCancellingId(bookingId);
    const res = await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
    setCancellingId(null);

    if (res.success) {
      toast.success('Booking cancelled and seat released.');
      loadData();
    } else {
      toast.error(res.error || 'Failed to cancel booking');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/member/classes"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Schedule Explorer</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Bookings Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                My Class Reservations
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                View your confirmed seats, past attendance, or cancel anytime.
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Loading your bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No bookings yet</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  You haven&apos;t booked any upcoming fitness classes.
                </p>
                <Link
                  href="/member/classes"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  Browse Class Schedule
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const startsAt = new Date(booking.session?.startsAt);
                  const isConfirmed = booking.status === 'CONFIRMED';
                  const isAttended = booking.status === 'ATTENDED';
                  const isCancelled = booking.status === 'CANCELLED';

                  return (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isAttended
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {booking.status}
                          </span>
                          <span className="text-xs font-medium text-slate-400">
                            Booked on {new Date(booking.bookedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {booking.session?.fitnessClass?.name || 'Fitness Class'}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {startsAt.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {startsAt.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{booking.session?.branch?.name}</span>
                          </div>
                        </div>
                      </div>

                      {isConfirmed && (
                        <div>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>
                              {cancellingId === booking.id ? 'Releasing...' : 'Cancel Seat'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Membership Card Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-2 rounded-xl bg-orange-500/20 text-primary">
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                  Active Member
                </span>
              </div>

              <div className="text-xs uppercase text-slate-400 font-semibold">Current Plan</div>
              <div className="text-2xl font-black mt-1">
                {subscription?.plan?.name || 'All-Access VIP Pass'}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-emerald-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valid Until:</span>
                  <span className="font-semibold">
                    {subscription?.expiresAt
                      ? new Date(subscription.expiresAt).toLocaleDateString()
                      : '30 Days'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Class Access:</span>
                  <span className="font-semibold">Unlimited</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Cancellation Policy</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Please cancel at least 2 hours before class start time to allow waitlisted members to be
                promoted into the session.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
