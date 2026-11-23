'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import { Building2, MapPin, Plus, DoorOpen, Users, Clock, X } from 'lucide-react';

export default function DashboardBranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  // Branch form
  const [branchName, setBranchName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');

  // Room form
  const [roomName, setRoomName] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('20');

  const loadBranches = async () => {
    setLoading(true);
    const res = await apiRequest('/branches');
    if (res.success && res.data) {
      setBranches(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiRequest('/branches', {
      method: 'POST',
      body: JSON.stringify({
        name: branchName,
        address,
        city,
      }),
    });
    if (res.success) {
      toast.success('Branch created successfully!');
      setBranchModalOpen(false);
      setBranchName('');
      setAddress('');
      loadBranches();
    } else {
      toast.error(res.error || 'Failed to create branch');
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiRequest(`/branches/${selectedBranchId}/rooms`, {
      method: 'POST',
      body: JSON.stringify({
        name: roomName,
        capacity: Number(roomCapacity),
      }),
    });
    if (res.success) {
      toast.success('Studio room added!');
      setRoomModalOpen(false);
      setRoomName('');
      loadBranches();
    } else {
      toast.error(res.error || 'Failed to add room');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gym Branches & Studios
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Physical locations, studio rooms, and local operational timezones.
          </p>
        </div>

        <button
          onClick={() => setBranchModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-xs shadow-sm transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Branch Location</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading branches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{b.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {b.address}, {b.city}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Active Location
                </span>
              </div>

              {/* Studio Rooms */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <DoorOpen className="h-4 w-4 text-slate-400" />
                    <span>Studio Rooms ({b.rooms?.length || 0})</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBranchId(b.id);
                      setRoomModalOpen(true);
                    }}
                    className="text-primary hover:text-orange-600 text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Room</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {b.rooms?.length === 0 ? (
                    <div className="text-slate-400 text-xs italic col-span-2">
                      No specific studio rooms created yet.
                    </div>
                  ) : (
                    b.rooms?.map((room: any) => (
                      <div
                        key={room.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between items-center"
                      >
                        <span className="font-semibold text-slate-800">{room.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Cap: {room.capacity}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Branch Modal */}
      {branchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Gym Branch</h3>
              <button
                onClick={() => setBranchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. FitZone Dhanmondi"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Road 27, Dhanmondi"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBranchModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-xs"
                >
                  Create Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Studio Room</h3>
              <button
                onClick={() => setRoomModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Room / Studio Name</label>
                <input
                  type="text"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Studio C - Spinning Hub"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Room Capacity</label>
                <input
                  type="number"
                  required
                  value={roomCapacity}
                  onChange={(e) => setRoomCapacity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setRoomModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-xs"
                >
                  Save Studio Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
