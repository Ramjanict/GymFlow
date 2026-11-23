'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Dumbbell className="h-4 w-4" />
            <span>Trainer Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Assigned Classes & Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your upcoming sessions and mark trainee attendance in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assigned Sessions List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Upcoming Sessions
            </h3>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No sessions scheduled.
              </div>
            ) : (
              sessions.map((s) => {
                const startsAt = new Date(s.startsAt);
                const isSelected = selectedSession?.id === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => loadSessionDetails(s.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                        {s.fitnessClass?.category?.name || 'Class'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {s.bookedCount} / {s.capacity} Enrolled
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {s.fitnessClass?.name}
                    </h4>

                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {startsAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {startsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Session Attendance Details */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-primary bg-orange-50 px-2.5 py-1 rounded">
                      {selectedSession.branch?.name}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-2">
                      {selectedSession.fitnessClass?.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedSession.fitnessClass?.description}
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <div className="text-2xl font-black text-slate-900">
                      {selectedSession.bookedCount} / {selectedSession.capacity}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Class Attendance Cap</div>
                  </div>
                </div>

                {/* Enrolled Trainees List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">
                      Enrolled Trainees ({selectedSession.bookings?.length || 0})
                    </h4>
                    <span className="text-xs text-slate-400">1-Click Check-in for Trainees</span>
                  </div>

                  {selectedSession.bookings?.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl">
                      No members have booked this occurrence yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                      {selectedSession.bookings?.map((b: any) => {
                        const isAttended = b.attendance?.status === 'PRESENT';

                        return (
                          <div
                            key={b.id}
                            className="p-3.5 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                {b.member?.user?.firstName?.[0]}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-xs">
                                  {b.member?.user?.firstName} {b.member?.user?.lastName}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {b.member?.user?.email}
                                </div>
                              </div>
                            </div>

                            {isAttended ? (
                              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Present</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleCheckInMember(b.id)}
                                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Check In</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                Select a class occurrence to view enrolled trainees.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
