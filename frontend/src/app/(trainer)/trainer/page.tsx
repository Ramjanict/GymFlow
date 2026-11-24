'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Dumbbell,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function TrainerPortalPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await apiRequest('/sessions');
    if (res.success && res.data) {
      setSessions(res.data);
      if (res.data.length > 0 && !selectedSession) {
        loadSessionDetails(res.data[0].id);
      }
    }
    setLoading(false);
  };

  const loadSessionDetails = async (id: string) => {
    const res = await apiRequest(`/sessions/${id}`);
    if (res.success && res.data) {
      setSelectedSession(res.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckInMember = async (bookingId: string) => {
    const res = await apiRequest('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });

    if (res.success) {
      toast.success('Member marked present!');
      if (selectedSession) {
        loadSessionDetails(selectedSession.id);
      }
    } else {
      toast.error('Failed to check in');
    }
  };

  return (
    <div className="min-h-screen bg-mesh-dark text-white flex flex-col selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Zap className="h-4 w-4" />
            <span>Trainer Operational Workspace</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Assigned Classes &amp; Member Attendance
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review your upcoming sessions and mark trainee attendance in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assigned Sessions List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Assigned Sessions ({sessions.length})
            </h2>

            {loading ? (
              <div className="text-xs text-zinc-500 py-8">Loading sessions...</div>
            ) : sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => loadSessionDetails(s.id)}
                    className={`glass-card-interactive p-4 rounded-2xl cursor-pointer ${
                      selectedSession?.id === s.id
                        ? 'border-primary shadow-glow-orange bg-white/[0.08]'
                        : 'border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        {s.class?.name || 'Class Session'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold">
                        {s.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-zinc-400 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>{s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '07:00 AM'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{s.branch?.name || 'FitZone Mirpur'} &bull; {s.room?.name || 'Studio A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-xs text-zinc-400 text-center">
                No sessions assigned to your profile today.
              </div>
            )}
          </div>

          {/* Session Roster Details & Check-In */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Live Roster &amp; Member Check-in
            </h2>

            {selectedSession ? (
              <div className="glass-card rounded-3xl p-6 border border-white/[0.08] space-y-6">
                <div className="flex items-start justify-between pb-6 border-b border-white/[0.06]">
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      Active Class Roster
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">
                      {selectedSession.class?.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedSession.branch?.name} &bull; {selectedSession.room?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Confirmed</p>
                    <p className="text-3xl font-black text-white">
                      {selectedSession.bookings?.length || 0} / {selectedSession.capacity || 20}
                    </p>
                  </div>
                </div>

                {/* Member List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Registered Members
                  </h4>
                  {selectedSession.bookings?.length > 0 ? (
                    <div className="divide-y divide-white/[0.06]">
                      {selectedSession.bookings.map((b: any) => (
                        <div key={b.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-white/[0.05] border border-white/[0.08] text-white flex items-center justify-center font-bold text-xs">
                              {b.user?.firstName?.[0] || 'M'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">
                                {b.user?.firstName} {b.user?.lastName}
                              </p>
                              <p className="text-[10px] text-zinc-400">{b.user?.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-[10px] font-bold text-zinc-300">
                              {b.status}
                            </span>
                            {b.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleCheckInMember(b.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-sm"
                              >
                                Mark Present
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 py-4">No member bookings yet for this session.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 text-center text-xs text-zinc-400 border border-white/[0.06]">
                Select a class session on the left to review trainee roster and mark attendance.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
