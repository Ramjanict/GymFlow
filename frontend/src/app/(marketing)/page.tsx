'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiRequest } from '@/lib/api';
import {
  Dumbbell,
  Users,
  Calendar,
  Flame,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  Lock,
  Layers,
  ChevronRight,
  MapPin,
  Check,
  Zap,
} from 'lucide-react';

export default function MarketingPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [classesRes, catRes] = await Promise.all([
        apiRequest('/classes'),
        apiRequest('/classes/categories'),
      ]);
      if (classesRes.success && classesRes.data) {
        setClasses(classesRes.data);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredClasses = selectedCategory
    ? classes.filter((c) => c.categoryId === selectedCategory)
    : classes;

  return (
    <div className="flex flex-col min-h-screen bg-dark-950 text-white selection:bg-primary selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36 bg-mesh-dark">
        {/* Glow light rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-accent-violet/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide">
              <Sparkles className="h-4 w-4" />
              <span>Multi-Tenant Enterprise Gym SaaS 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              Scale Your Gym Network. <br />
              <span className="text-gradient-primary">
                Zero Overbooking.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light max-w-2xl">
              Engineered for multi-branch gym chains, fitness studios, and combat academies.
              Manage independent organizations, eliminate double-bookings with database row-level locking,
              automate waitlists, and coordinate trainers in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/member/classes"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-primary/30 border border-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Classes (Member)</span>
              </Link>
              <Link
                href="/dashboard/overview"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-100 font-bold text-xs uppercase tracking-wider border border-white/[0.1] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Building2 className="h-4 w-4 text-primary" />
                <span>Gym Dashboard</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 font-bold text-xs uppercase tracking-wider border border-violet-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShieldCheck className="h-4 w-4 text-violet-400" />
                <span>Super Admin</span>
              </Link>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.08] max-w-xl">
              <div>
                <p className="text-2xl font-black text-white">40k+</p>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Bookings Processed</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">100%</p>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Concurrency Safe</p>
              </div>
              <div>
                <p className="text-2xl font-black text-primary">5 Portals</p>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Role-Based Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Highlights Section */}
      <section className="py-20 border-y border-white/[0.06] bg-dark-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-2">
              Architected for Enterprise Gym Operations
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              Clean separation of concerns with tenant isolation and automated workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] relative group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Tenant Isolation</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-light">
                Every gym organization owns an isolated tenant domain. Branches, trainers, and data are strictly bound to organization IDs.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] relative group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Overbooking Engine</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-light">
                Pessimistic row-level locking guarantees that concurrent member bookings never exceed physical studio capacity.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] relative group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Automated Waitlists</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-light">
                When a class fills up, members are placed in a FIFO queue. Cancellations automatically promote the next member.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] relative group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">RBAC &amp; JWT Security</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-light">
                Dual-token rotation (15m access, 7d refresh) with strict role guards: Super Admin, Owner, Manager, Trainer, Member.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Class Curriculum Explorer Section */}
      <section id="classes" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Live Curriculum Explorer
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-1">
              Featured Fitness Programs
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Synced live with PostgreSQL and Cloudinary asset management.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === ''
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Classes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-3xl overflow-hidden border border-white/[0.08] flex flex-col group"
              >
                <div className="relative h-52 w-full overflow-hidden bg-dark-900">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop'
                    }
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {item.level || 'All Levels'}
                    </span>
                  </div>
                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-zinc-300 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span>{item.duration} min</span>
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-light">
                      {item.description || 'Professional athletic training session with certified coaching.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Capacity: <strong className="text-white">{item.capacity}</strong></span>
                    </div>

                    <Link
                      href="/member/classes"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-orange-400 transition-colors"
                    >
                      <span>Book Session</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 glass-card rounded-3xl border border-white/[0.06] text-zinc-400 text-xs">
              {loading ? 'Loading classes from database...' : 'No classes found in this category.'}
            </div>
          )}
        </div>
      </section>

      {/* Branches Showcase Section */}
      <section className="py-20 border-t border-white/[0.06] bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                Multi-Branch Infrastructure
              </span>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                FitZone Flagship Locations
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Each branch operates dedicated fitness studios, trainer schedules, and member access controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    Branch A &bull; Open Now
                  </span>
                  <h3 className="text-2xl font-black text-white mt-3">FitZone Mirpur Center</h3>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Plot 12, Main Road, Section 2, Dhaka</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/[0.06] grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">Studios</p>
                  <p className="text-zinc-200 font-medium mt-0.5">Studio A (Yoga) &bull; Studio B (HIIT)</p>
                </div>
                <div>
                  <p className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">Timezone</p>
                  <p className="text-zinc-200 font-medium mt-0.5">Asia/Dhaka (GMT+6)</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    Branch B &bull; Open Now
                  </span>
                  <h3 className="text-2xl font-black text-white mt-3">FitZone Gulshan Elite</h3>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Road 45, Gulshan-2, Dhaka</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/[0.06] grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">Studios</p>
                  <p className="text-zinc-200 font-medium mt-0.5">Reformer Pilates &bull; Strength Zone</p>
                </div>
                <div>
                  <p className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">Timezone</p>
                  <p className="text-zinc-200 font-medium mt-0.5">Asia/Dhaka (GMT+6)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            SaaS Subscription Tiers
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white mt-1">
            Predictable Platform Pricing
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            Every plan includes multi-branch management, waitlist automation, and role-based staff access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="glass-card rounded-3xl p-8 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Starter</span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$49</span>
                <span className="text-xs text-zinc-400">/month</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">For single boutique fitness or combat studios.</p>
              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 1 Physical Branch</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 100 Members</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 5 Dedicated Trainers</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Class Booking Engine</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold uppercase tracking-wider text-center border border-white/[0.1] transition-all"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Professional - Highlighted */}
          <div className="glass-card rounded-3xl p-8 border-2 border-primary shadow-glow-orange flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                Most Popular
              </span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Professional</span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$149</span>
                <span className="text-xs text-zinc-400">/month</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">For growing gym networks and fitness clubs.</p>
              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 5 Branches</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 1,000 Members</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 30 Trainers &amp; Coaches</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Automated Waitlist Engine</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Cloudinary Media Uploads</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold uppercase tracking-wider text-center shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Enterprise */}
          <div className="glass-card rounded-3xl p-8 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Enterprise</span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$399</span>
                <span className="text-xs text-zinc-400">/month</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">For nationwide gym franchises and athletic chains.</p>
              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400" /> Up to 50 Branches</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400" /> 10,000+ Members</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400" /> 200 Trainers</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400" /> Dedicated Neon Database Pool</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400" /> Custom Domain &amp; White-label</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold uppercase tracking-wider text-center border border-white/[0.1] transition-all"
            >
              Contact Enterprise
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
