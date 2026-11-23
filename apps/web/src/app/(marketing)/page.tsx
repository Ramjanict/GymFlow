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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.25),rgba(255,255,255,0))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wide">
              <Sparkles className="h-4 w-4" />
              <span>Multi-Tenant Gym SaaS Platform 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Scale Your Gym Network. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-amber-200">
                Zero Overbooking.
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed font-light">
              Full-production multi-tenant platform architected for modern gym businesses. Manage
              multiple branches, coordinate trainers, prevent booking collisions with row-level
              locking, and automate waitlists in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/member/classes"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25 transition-all text-sm"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Classes (Member)</span>
              </Link>
              <Link
                href="/dashboard/overview"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-all text-sm"
              >
                <Building2 className="h-4 w-4" />
                <span>Open Gym Dashboard</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 font-semibold border border-purple-800/40 transition-all text-sm"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Super Admin</span>
              </Link>
            </div>

            {/* Quick Demo Credentials Banner */}
            <div className="mt-8 rounded-xl bg-slate-900/80 border border-slate-800 p-4 text-xs text-slate-300">
              <div className="font-semibold text-orange-400 mb-2 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                <span>Pre-configured Demo Accounts (Instant Test Access):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <div className="text-slate-400">Gym Owner:</div>
                  <div className="font-mono text-white">owner@fitzone.com</div>
                  <div className="text-slate-500">Pass: 123456</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <div className="text-slate-400">Trainer:</div>
                  <div className="font-mono text-white">trainer@fitzone.com</div>
                  <div className="text-slate-500">Pass: 123456</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <div className="text-slate-400">Member:</div>
                  <div className="font-mono text-white">member@fitzone.com</div>
                  <div className="text-slate-500">Pass: 123456</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-orange-50 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Tenant Isolation</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Row-level security boundary per organization ensuring zero cross-tenant leakage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No Overbooking</h3>
                <p className="text-xs text-slate-500 mt-1">
                  PostgreSQL transactional row locking (<code className="font-mono">FOR UPDATE</code>) ensures strict capacity integrity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Auto Waitlist</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Immediate FIFO member promotion upon booking cancellation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Multi-Branch</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Coordinate Mirpur, Gulshan, and future physical branches under one unified SaaS account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Catalog Section */}
      <section id="classes" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                Fitness Programs
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                World-Class Gym Sessions
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Browse high-intensity, mindfulness, and strength programs across all branches.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === ''
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Classes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop'
                    }
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {item.category?.name || 'Fitness'}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
                    {item.level || 'All Levels'}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.description || 'Elevate your fitness journey with our elite trainers.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>{item.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>Cap: {item.capacity} trainees</span>
                      </div>
                    </div>

                    <Link
                      href="/member/classes"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-xs transition-colors"
                    >
                      <span>View & Book Occurrence</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memberships Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              Membership Plans
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Join FitZone and gain direct access to our world-class trainers and group workout schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
            {/* Plan 1 */}
            <div className="rounded-2xl border border-slate-200 p-8 flex flex-col justify-between bg-white shadow-sm hover:border-slate-300 transition-all">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Standard Member
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">৳2,500</span>
                  <span className="text-xs font-medium text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Ideal for casual trainees looking for weekly classes and single-branch access.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Up to 12 scheduled classes per month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Access to FitZone Mirpur Center</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Self-service booking & cancellation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Waitlist auto-promotion</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 flex items-center justify-center w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                Join Standard
              </Link>
            </div>

            {/* Plan 2 */}
            <div className="rounded-2xl border-2 border-primary p-8 flex flex-col justify-between bg-gradient-to-b from-orange-50/40 to-white shadow-lg shadow-orange-500/10 relative">
              <div className="absolute -top-3.5 right-6 bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary">
                  All-Access VIP
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">৳4,500</span>
                  <span className="text-xs font-medium text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Complete freedom. Multi-branch access across all Dhaka locations with unlimited bookings.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-slate-800">Unlimited class bookings</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-slate-800">Multi-Branch Access (Mirpur & Gulshan)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Priority waitlist position</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Complimentary locker & sauna</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Trainer 1-on-1 consultation session</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 flex items-center justify-center w-full py-3 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition-all"
              >
                Join All-Access VIP
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
