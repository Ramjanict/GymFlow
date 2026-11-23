# GymFlow — Multi-Tenant Gym Scheduling & Membership SaaS Platform

GymFlow is an enterprise-scale, production-ready Multi-Tenant SaaS platform architected for modern gym chains and boutique fitness studios. Multiple independent gym businesses can register, operate multiple branches (e.g. Mirpur, Gulshan), coordinate trainers, schedule recurring classes, and prevent class overbooking with transactional row-level concurrency locks.

---

## ⚡ Tech Stack Architecture

- **Backend**: [NestJS](https://nestjs.com/) (Modular Monolith, TypeScript, Passport.js, JWT Token Rotation, Swagger API Gateway)
- **Database**: [PostgreSQL on Neon](https://neon.tech/) with [Prisma ORM](https://www.prisma.io/) (33 entities, composite tenant isolation keys)
- **Frontend**: [Next.js 14 App Router](https://nextjs.org/) (TypeScript, Tailwind CSS, Redux Toolkit, React Toastify, Lucide Icons)
- **Asset Storage**: [Cloudinary](https://cloudinary.com/) (`ku04x3pn`)
- **Monorepo**: [pnpm Workspaces](https://pnpm.io/) + [Turborepo](https://turbo.build/)

---

## 🏢 Platform Portals & Logical Workspaces

GymFlow provides dedicated role-based portals:

| Portal | URL Route | Scope | Target Audience |
| :--- | :--- | :--- | :--- |
| **Marketing Website** | `/` | Public | Prospective gym members & business owners |
| **Member Portal** | `/member/classes`, `/member/bookings` | Tenant Member | Class discovery, 1-click booking, active membership pass |
| **Gym Admin Dashboard** | `/dashboard/overview` | Gym Tenant (FitZone) | Gym owners, branch managers, receptionists |
| **Trainer Workspace** | `/trainer` | Trainer | Assigned class rosters, member check-in |
| **Super Admin Platform** | `/admin` | Platform Wide | Platform operator, SaaS subscriptions & tenant audits |

---

## 🔑 Pre-Seeded Demo Credentials

The database on Neon PostgreSQL is already seeded and ready for instant testing:

| Role | Email | Password | Default Portal Landing |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@gymflow.com` | `Admin12345!` | `/admin` |
| **Gym Owner** | `owner@fitzone.com` | `123456` | `/dashboard/overview` |
| **Trainer** | `trainer@fitzone.com` | `123456` | `/trainer` |
| **Member** | `member@fitzone.com` | `123456` | `/member/classes` |

---

## 🛡️ Critical Business Logic & Concurrency

### 1. Zero Overbooking via Row-Level Locking
When multiple members attempt to book the last available seat in a class session concurrently, GymFlow initiates a database transaction with PostgreSQL row-level locking:
```sql
SELECT * FROM "ClassSession" WHERE id = $1 FOR UPDATE;
```
If the capacity is exhausted, the member is placed in the waitlist at their sequential FIFO position.

### 2. Automated Waitlist Promotion
When a member cancels a confirmed booking:
1. The booking status updates to `CANCELLED`.
2. The session's `bookedCount` decrements.
3. The next member on the waitlist (`position = 1`) is promoted to `CONFIRMED` in the same transaction.

### 3. Recurring Class Scheduling Engine
Schedules define recurrence rules (e.g. Mon/Wed/Fri 09:00 AM - 10:00 AM) and automatically generate individual occurrences (`ClassSession`) 30 days in advance without duplicating past history.

---

## 🚀 Running the Project Locally

### 1. Backend (NestJS + PostgreSQL on Neon)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db:seed
npm run start:dev
```
- **API Base URL**: `http://localhost:4000/api/v1`
- **Swagger Documentation**: `http://localhost:4000/api/docs`

### 2. Frontend (Next.js 14 App Router)
```bash
cd frontend
npm install
npm run dev
```
- **Web App**: `http://localhost:3000`

---

## 📦 Directory Structure

```
GymFlow/
├── backend/                     # NestJS API Gateway (Prisma, PostgreSQL, JWT, Swagger)
│   ├── prisma/schema.prisma     # 33 relational PostgreSQL entities on Neon DB
│   └── src/
│       ├── modules/             # Auth, Organizations, Branches, Classes, Sessions, Bookings, etc.
│       ├── common/              # TenantGuard, PermissionsGuard, Decorators
│       └── database/            # PrismaService & Database Seeder
├── frontend/                    # Next.js 14 App Router (Tailwind CSS, Redux, Lucide)
│   └── src/
│       ├── app/                 # (marketing), (auth), (gym), (trainer), (member), (platform)
│       ├── components/          # UI & Layout components
│       ├── store/               # Redux Toolkit & Auth Slice
│       └── lib/                 # API client & helpers
├── .gitignore
└── README.md
```

---

## 👨‍💻 Author

Architected and developed by **[Md Ramjan Ali](https://github.com/Ramjanict)** (`mdramjan.ict@gmail.com`).
