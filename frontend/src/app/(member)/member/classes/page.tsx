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
  Users,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function MemberClassesPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [bookingSessionId, setBookingSessionId] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoading(true);
    const [sessRes, branchRes] = await Promise.all([
      apiRequest('/sessions'),
      apiRequest('/branches'),
    ]);

    if (sessRes.success && sessRes.data) {
      setSessions(sessRes.data);
    }
    if (branchRes.success && branchRes.data) {
      setBranches(branchRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleBookSession = async (sessionId: string) => {
    setBookingSessionId(sessionId);
    const res = await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
    setBookingSessionId(null);

    if (res.success) {
      if (res.status === 'WAITLISTED') {
        toast.info(res.message || 'Added to waitlist');
      } else {
        toast.success(res.message || 'Class booked successfully!');
      }
      loadSessions(); // refresh counts
    } else {
      toast.error(res.error || 'Failed to book class. Please ensure you have an active membership.');
    }
  };

  const filteredSessions = selectedBranch
    ? sessions.filter((s) => s.branchId === selectedBranch)
    : sessions;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Dumbbell className="h-4 w-4" />
              <span>Member Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Class Schedule & Booking
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live seat availability backed by atomic concurrency protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/member/bookings"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <Calendar className="h-4 w-4" />
              <span>My Active Bookings</span>
            </Link>
          </div>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedBranch('')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedBranch === ''
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Branches
          </button>
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedBranch === b.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {b.name} ({b.city})
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading scheduled sessions from Neon DB...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No scheduled sessions found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Check back soon or select another branch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const startsAt = new Date(session.startsAt);
              const endsAt = new Date(session.endsAt);
              const isFull = session.bookedCount >= session.capacity;
              const spotsLeft = Math.max(0, session.capacity - session.bookedCount);
              const trainer = session.trainers?.[0]?.trainer?.user;

              return (
                <div
                  key={session.id}
                  className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-5"
                >
                  <div>
                    {/* Badge & Branch */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold text-primary bg-orange-50 px-2.5 py-1 rounded-md">
                        {session.fitnessClass?.category?.name || 'Class'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{session.branch?.name}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {session.fitnessClass?.name}
                    </h3>

                    {/* Time & Date */}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold text-slate-800">
                          {startsAt.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>
                          {startsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {endsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Trainer */}
                    {trainer && (
                      <div className="mt-4 flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl">
                        <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {trainer.firstName[0]}
                        </div>
                        <div className="text-xs">
                          <div className="font-semibold text-slate-800">
                            {trainer.firstName} {trainer.lastName}
                          </div>
                          <div className="text-[10px] text-slate-500">Class Instructor</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking Footer with Capacity Bar */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>Booked</span>
                        </span>
                        <span className="font-bold text-slate-800">
                          {session.bookedCount} / {session.capacity}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isFull ? 'bg-rose-500' : 'bg-primary'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (session.bookedCount / session.capacity) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookSession(session.id)}
                      disabled={bookingSessionId === session.id}
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                        isFull
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-primary hover:bg-orange-600 text-white shadow-orange-500/20'
                      }`}
                    >
                      {bookingSessionId === session.id ? (
                        <span>Processing...</span>
                      ) : isFull ? (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span>Full — Join Waitlist</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Book Seat ({spotsLeft} Left)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
