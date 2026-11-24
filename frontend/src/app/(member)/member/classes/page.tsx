'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  Sparkles,
  Zap,
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
    <div className="min-h-screen bg-mesh-dark text-white flex flex-col selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Member Experience Portal</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              Class Schedule &amp; Instant Booking
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time seat availability backed by atomic concurrency protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/member/bookings"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 border border-primary/30 transition-all hover:scale-[1.02]"
            >
              <Calendar className="h-4 w-4" />
              <span>My Active Bookings</span>
            </Link>
          </div>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-8 max-w-fit">
          <button
            onClick={() => setSelectedBranch('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              selectedBranch === ''
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Branches
          </button>
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedBranch === b.id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Sessions List / Cards */}
        {loading ? (
          <div className="text-center py-20 text-xs text-zinc-500">
            Loading scheduled sessions from database...
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const fitnessClass = session.class || {};
              const branch = session.branch || {};
              const room = session.room || {};
              const isFull = (session.confirmedCount || 0) >= (session.capacity || 20);
              const isBooking = bookingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className="glass-card rounded-3xl p-6 border border-white/[0.08] flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-primary">
                        {fitnessClass.level || 'All Levels'}
                      </span>
                      <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>{session.startTime ? new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '07:00 AM'}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {fitnessClass.name || 'Athletic Conditioning Session'}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 font-light">
                        {fitnessClass.description || 'Intensive workout designed for athletic conditioning and strength.'}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{branch.name || 'FitZone Mirpur'} &bull; {room.name || 'Studio A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        <span>Confirmed: <strong className="text-white">{session.confirmedCount || 0}</strong> / {session.capacity || 20}</span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull ? 'bg-rose-500' : 'bg-primary'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            ((session.confirmedCount || 0) / (session.capacity || 20)) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookSession(session.id)}
                    disabled={isBooking}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isFull
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-primary/25 border border-primary/30 hover:scale-[1.01]'
                    }`}
                  >
                    {isBooking ? (
                      <span>Processing...</span>
                    ) : isFull ? (
                      <span>Join Waitlist</span>
                    ) : (
                      <>
                        <span>Book Spot</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border border-white/[0.06] text-zinc-400 text-xs">
            No class sessions scheduled for this branch yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
