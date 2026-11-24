'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, Database, Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-dark-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-md shadow-primary/20">
                <Dumbbell className="h-5 w-5 rotate-45" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Gym<span className="text-gradient-primary">Flow</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Enterprise multi-tenant SaaS for athletic gym clubs, combat arenas, and fitness studios.
              Row-level concurrency, automated waitlists, and branch management.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Neon PostgreSQL + Cloudinary Live</span>
            </div>
          </div>

          {/* Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">
              Platform Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/member/classes" className="hover:text-primary transition-colors">
                  Member Portal (Class Booking)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/overview" className="hover:text-primary transition-colors">
                  Gym Business Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trainer" className="hover:text-primary transition-colors">
                  Trainer Check-in Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Super Admin Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">
              Technology Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-zinc-400">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Next.js 14 App Router + TypeScript</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-400">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                <span>NestJS Modular API Gateway</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Prisma ORM & Neon Serverless DB</span>
              </li>
            </ul>
          </div>

          {/* Contact / Organization */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">
              Active Demo Tenant
            </h4>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <p className="text-xs font-semibold text-white">FitZone Global Fitness</p>
              <p className="text-[11px] text-zinc-400">Mirpur & Gulshan Elite Branches</p>
              <p className="text-[11px] text-primary font-medium">contact@fitzone.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} GymFlow Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for high performance SaaS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
