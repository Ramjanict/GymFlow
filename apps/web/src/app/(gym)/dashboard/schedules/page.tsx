'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import { Calendar, Plus, Clock, MapPin, RefreshCw, X } from 'lucide-react';

export default function DashboardSchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Form state
  const [fitnessClassId, setFitnessClassId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
  const [submitting, setSubmitting] = useState(false);

  const daysList = [
    { label: 'Mon', value: 'MONDAY' },
    { label: 'Tue', value: 'TUESDAY' },
    { label: 'Wed', value: 'WEDNESDAY' },
    { label: 'Thu', value: 'THURSDAY' },
    { label: 'Fri', value: 'FRIDAY' },
    { label: 'Sat', value: 'SATURDAY' },
    { label: 'Sun', value: 'SUNDAY' },
  ];

  const loadData = async () => {
    setLoading(true);
    const [schedRes, classRes, branchRes] = await Promise.all([
      apiRequest('/schedules'),
      apiRequest('/classes'),
      apiRequest('/branches'),
    ]);

    if (schedRes.success && schedRes.data) setSchedules(schedRes.data);
    if (classRes.success && classRes.data) setClasses(classRes.data);
    if (branchRes.success && branchRes.data) setBranches(branchRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error('Select at least one day of the week');
      return;
    }
    setSubmitting(true);

    const res = await apiRequest('/schedules', {
      method: 'POST',
      body: JSON.stringify({
        fitnessClassId,
        branchId,
        startTime,
        endTime,
        startDate,
        daysOfWeek: selectedDays,
      }),
    });

    setSubmitting(false);

    if (res.success) {
      toast.success('Schedule created and 30-day session occurrences generated!');
      setModalOpen(false);
      loadData();
    } else {
      toast.error(res.error || 'Failed to create schedule');
    }
  };

  const handleTriggerGenerate = async (scheduleId: string) => {
    setGeneratingId(scheduleId);
    const res = await apiRequest(`/schedules/${scheduleId}/generate`, {
      method: 'POST',
    });
    setGeneratingId(null);

    if (res.success) {
      toast.success(res.message || 'Sessions generated');
      loadData();
    } else {
      toast.error('Failed to generate sessions');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Recurring Class Scheduling Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automate daily and weekly class occurrences without duplicating records.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-xs shadow-sm transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>New Recurring Schedule</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading schedules...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((sched) => (
            <div
              key={sched.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary bg-orange-50 px-2.5 py-0.5 rounded">
                    {sched.branch?.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {sched._count?.sessions || 0} active sessions
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {sched.fitnessClass?.name || 'Class'}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold">
                    {sched.startTime} - {sched.endTime}
                  </span>
                </div>

                {/* Days of Week Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sched.daysOfWeek?.map((d: string) => (
                    <span
                      key={d}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase"
                    >
                      {d.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Recurrence: Weekly</span>
                <button
                  onClick={() => handleTriggerGenerate(sched.id)}
                  disabled={generatingId === sched.id}
                  className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-primary font-semibold transition-colors"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${generatingId === sched.id ? 'animate-spin' : ''}`}
                  />
                  <span>Sync 30 Days</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Create Recurring Schedule</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fitness Class</label>
                <select
                  required
                  value={fitnessClassId}
                  onChange={(e) => setFitnessClassId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.duration} mins)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Location</label>
                <select
                  required
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Days of Week</label>
                <div className="flex flex-wrap gap-2">
                  {daysList.map((d) => {
                    const isSelected = selectedDays.includes(d.value);
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => toggleDay(d.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
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
                  {submitting ? 'Generating...' : 'Save & Generate Sessions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
