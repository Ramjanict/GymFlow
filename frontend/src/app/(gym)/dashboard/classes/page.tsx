'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Dumbbell,
  Plus,
  Clock,
  Users,
  Sparkles,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export default function DashboardClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('60');
  const [capacity, setCapacity] = useState('20');
  const [level, setLevel] = useState('All Levels');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [cRes, catRes] = await Promise.all([
      apiRequest('/classes'),
      apiRequest('/classes/categories'),
    ]);
    if (cRes.success && cRes.data) setClasses(cRes.data);
    if (catRes.success && catRes.data) setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const res = await apiRequest('/upload/image', {
        method: 'POST',
        body: JSON.stringify({ file: base64, folder: 'gymflow_classes' }),
      });
      if (res.success && res.data?.url) {
        setImageUrl(res.data.url);
        toast.success('Image uploaded to Cloudinary!');
      } else {
        toast.error('Failed to upload image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await apiRequest('/classes', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        duration: Number(duration),
        capacity: Number(capacity),
        level,
        categoryId: categoryId || undefined,
        image:
          imageUrl ||
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
      }),
    });

    setSubmitting(false);

    if (res.success) {
      toast.success('Fitness class created successfully!');
      setModalOpen(false);
      // Reset form
      setName('');
      setDescription('');
      setImageUrl('');
      loadData();
    } else {
      toast.error(res.error || 'Failed to create class');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Curriculum Management</span>
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Fitness Class Catalog
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Define your gym&apos;s curriculum, capacity limits, and difficulty tiers.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 border border-primary/30 transition-all hover:scale-[1.02] w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Fitness Class</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-500 text-xs">Loading classes from database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl overflow-hidden border border-white/[0.08] flex flex-col justify-between group"
            >
              <div className="h-48 w-full bg-dark-900 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white border border-white/10">
                  {item.category?.name || 'Program'}
                </span>
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded-full border border-white/10">
                  {item.level}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-white/[0.06] pt-3.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>{item.duration} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Max <strong className="text-white">{item.capacity}</strong> Trainees</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span>Create Fitness Program</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Class Program Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Olympic Lifting Mastery"
                  className="mt-1.5 w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Program overview and training expectations..."
                  className="mt-1.5 w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1.5 w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="mt-1.5 w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    Difficulty Tier
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="mt-1.5 w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white focus:outline-none bg-dark-900"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white focus:outline-none bg-dark-900"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cloudinary Image Upload */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Cover Image (Cloudinary Storage)
                </label>
                <div className="mt-1.5 flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] cursor-pointer text-xs font-semibold text-zinc-200 transition-colors">
                    <Upload className="h-4 w-4 text-primary" />
                    <span>Upload to Cloudinary</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {imageUrl && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>Ready</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 border border-primary/30 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
