import React from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                <Dumbbell className="h-5 w-5 rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Gym<span className="text-primary">Flow</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enterprise multi-tenant gym scheduling and membership management platform.
              Operate multiple branches, coordinate trainers, and prevent class overbooking with high-concurrency scheduling.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
              <ShieldCheck className="h-4 w-4" />
              <span>Multi-Tenant Row-Level Isolation</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Platform Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/member/classes" className="hover:text-primary transition-colors">
                  Member Booking Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/overview" className="hover:text-primary transition-colors">
                  Gym Owner Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trainer" className="hover:text-primary transition-colors">
                  Trainer Schedule & Check-in
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Platform Super Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Features
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Concurrency Lock Booking</li>
              <li>Automated Waitlist Promotion</li>
              <li>Multi-Branch & Room Management</li>
              <li>Trainer Conflict Detection</li>
              <li>Attendance & QR Check-in</li>
              <li>Revenue & Retention Reports</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Contact & HQ
            </h4>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Mirpur-2 / Gulshan, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span>mdramjan.ict@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>+880 1303-488984</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} GymFlow SaaS. Architected by Md Ramjan Ali.</p>
          <div className="flex items-center gap-1">
            <span>Built for high-performance fitness operations</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
