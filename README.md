# GymFlow — Enterprise Multi-Tenant Gym Scheduling & Membership SaaS

[![Production Frontend](https://img.shields.io/badge/Vercel-Frontend%20Live-black?style=for-the-badge&logo=vercel)](https://gymflow-latest.vercel.app/)
[![Production Backend](https://img.shields.io/badge/Render-Backend%20API-46E3B7?style=for-the-badge&logo=render)](https://gymflow-88r1.onrender.com/api/v1)
[![Swagger API Docs](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://gymflow-88r1.onrender.com/api/docs)
[![Database](https://img.shields.io/badge/Neon-Serverless%20PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Media Storage](https://img.shields.io/badge/Cloudinary-CDN%20Storage-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

GymFlow is a production-grade, commercial Multi-Tenant SaaS platform architected for modern gym chains, athletic combat academies, and fitness studios. Independent gym businesses can register, operate multiple branches, manage trainers, schedule recurring classes, and prevent class overbooking with transactional database row-level concurrency locks.

---

## 🌐 Live Deployments & Endpoints

| Service | Environment | Direct URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Production (Vercel) | [https://gymflow-latest.vercel.app/](https://gymflow-latest.vercel.app/) |
| **Backend REST API** | Production (Render) | [https://gymflow-88r1.onrender.com/api/v1](https://gymflow-88r1.onrender.com/api/v1) |
| **Interactive Swagger Docs** | Production (Render) | [https://gymflow-88r1.onrender.com/api/docs](https://gymflow-88r1.onrender.com/api/docs) |
| **GitHub Repository** | Main Branch | [https://github.com/Ramjanict/GymFlow](https://github.com/Ramjanict/GymFlow) |

---

## 🔑 Demo Login Credentials (All Portals)

The production database is seeded with real accounts across all 4 platform roles. You can log in at [https://gymflow-latest.vercel.app/login](https://gymflow-latest.vercel.app/login) (or click the 1-click quick fill buttons on the sign-in card):

| Role | Email Address | Password | Workspace / Landing Portal | Permissions & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@gymflow.com` | `Admin12345!` | [`/admin`](https://gymflow-latest.vercel.app/admin) | Global platform orchestration, tenant status toggle, infrastructure audit |
| **Gym Owner** | `owner@fitzone.com` | `123456` | [`/dashboard/overview`](https://gymflow-latest.vercel.app/dashboard/overview) | Full business management: branches, studios, programs, schedules, rosters |
| **Trainer** | `trainer@fitzone.com` | `123456` | [`/trainer`](https://gymflow-latest.vercel.app/trainer) | Assigned class rosters, trainee attendance check-in, schedule view |
| **Member** | `member@fitzone.com` | `123456` | [`/member/classes`](https://gymflow-latest.vercel.app/member/classes) | Class catalog discovery, 1-click booking, waitlist queue, active passes |

---

## 🏢 Platform Portals & Logical Workspaces

GymFlow enforces role-based navigation and tenant boundaries through 5 dedicated portals:

```
                              GymFlow Platform
                                     │
     ┌───────────────────────┬───────┴───────────────┬───────────────────────┐
     ▼                       ▼                       ▼                       ▼
Marketing Portal      Member Workspace         Gym Operations          Super Admin
  (Public Site)       (Class Bookings)           Dashboard            (Platform SaaS)
 gymflow.com/          /member/classes       /dashboard/overview          /admin
```

1. **Public Marketing Website** (`/`): High-converting dark-glassmorphism landing page with live curriculum explorer, branch showcases, and 3-tier SaaS pricing plans.
2. **Member Booking Portal** (`/member/classes`, `/member/bookings`): Trainee dashboard for seat reservations, waitlist tracking, and schedule filtering by branch.
3. **Gym Operations Dashboard** (`/dashboard/*`): Real-time analytics, revenue tracking, branch studio allocation, recurring schedule generator, and Cloudinary media upload.
4. **Trainer Workspace** (`/trainer`): Focused roster interface where trainers review assigned sessions and mark member attendance present with a single click.
5. **Super Admin Platform Console** (`/admin`): Multi-tenant oversight, tenant status activation/suspension, and serverless pool health monitoring.

---

## 🏗️ Full-Stack System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js 14 App Router (Frontend)                     │
│   • Dark Glassmorphism Design System (Tailwind CSS)                    │
│   • 5 Role Workspaces: Marketing, Member, Gym, Trainer, Super Admin     │
│   • Redux Toolkit + RTK Query Client Caching                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  NestJS Modular Gateway (Backend)                      │
│   • Global Prefix: /api/v1  • Swagger Documentation: /api/docs         │
│   • Guards: JwtAuthGuard, PermissionsGuard, TenantGuard                │
│   • Interceptors: ClassSerializer, TransformResponse, ExceptionFilter  │
└──────┬──────────────────────┬──────────────────────────┬───────────────┘
       │                      │                          │
       ▼                      ▼                          ▼
┌──────────────┐       ┌──────────────┐          ┌──────────────┐
│ Neon Serverless│       │  Cloudinary  │          │    JWT /     │
│  PostgreSQL  │       │ CDN Storage  │          │ Token Store  │
│  Prisma ORM  │       │ Media Assets │          │ Dual Rotation│
└──────────────┘       └──────────────┘          └──────────────┘
```

---

## ⚙️ Backend Architecture (NestJS)

The backend is built as a **Modular Monolith** using NestJS and TypeScript.

### 1. Modular Boundaries
- **`AuthModule`**: Passport.js JWT strategy, BCrypt password hashing, token issuance, refresh rotation, and cookie handling.
- **`OrganizationsModule`**: Multi-tenant boundary management, status transitions (`ACTIVE`, `PENDING`, `SUSPENDED`).
- **`BranchesModule`**: Physical gym branch locations, address metadata, timezone definitions (`Asia/Dhaka`), and dedicated rooms/studios.
- **`ClassesModule`**: Fitness curriculum catalog, difficulty tiers, durations, and category taxonomies.
- **`SchedulesModule`**: Recurrence rules engine generating session instances up to 30 days in advance.
- **`SessionsModule`**: Individual class session instances, trainer allocations, room capacity limits.
- **`BookingsModule`**: Atomic row-locked reservation pipeline with automated FIFO waitlists.
- **`AttendanceModule`**: QR/trainer member check-in verification and historical attendance logging.
- **`MembershipsModule`**: Membership subscription tiers, pricing, and branch access controls.
- **`DashboardModule`**: Role-scoped metrics (revenue aggregates, booking volumes, capacity percentages).
- **`UploadModule`**: Cloudinary integration for signed media hosting (`cloud_name: ramjan`, preset: `voltix`).

### 2. Multi-Tenant Isolation Strategy
- **Shared Database, Shared Schema**: Uses `organizationId` as the strict tenant boundary on all business tables.
- **Composite Unique Keys**: `@@unique([organizationId, slug])` ensures branch and class slugs remain unique within a gym while preventing collisions across different organizations.
- **Tenant Context Injection**: NestJS `@CurrentTenant()` decorator and `TenantGuard` automatically extract tenant identity from the JWT or the `X-Organization-Id` header.

### 3. Concurrency Protection & Zero Overbooking Engine
To guarantee zero double-booking under extreme concurrency, booking transactions execute with PostgreSQL row-level locks:
```sql
SELECT * FROM "ClassSession" WHERE id = $1 FOR UPDATE;
```
1. **Capacity Available**: Booking is created with `CONFIRMED` status, and session `confirmedCount` increments atomically.
2. **Capacity Exhausted**: Booking is assigned `WAITLISTED` status with an incremental FIFO queue position.
3. **Cancellation & Promotion**: When a booking is cancelled, the session count decrements and the member with `position = 1` on the waitlist is atomically promoted to `CONFIRMED` in the same database transaction.

---

## 🎨 Frontend Architecture (Next.js 14 & TypeScript)

The frontend uses Next.js 14 App Router, TypeScript, and a custom **Luxury Athletic Dark-Glassmorphism** design system.

### 1. Route Directory Architecture
```
frontend/src/app/
├── (marketing)/             # Public landing page with curriculum explorer
├── (auth)/
│   ├── login/               # Sign-in with 1-click quick demo fill & offline fallback
│   └── register/            # Dual registration: Gym business or member pass
├── (gym)/dashboard/
│   ├── overview/            # Executive KPI metrics & studio capacity allocation
│   ├── classes/             # Class management & Cloudinary image uploader
│   ├── branches/            # Gym branch locations & studio rooms
│   ├── schedules/           # Recurring schedule rule generator
│   ├── bookings/            # Master bookings table & waitlist monitor
│   └── memberships/         # Subscription plans management
├── (member)/member/
│   ├── classes/             # Live schedule discovery & 1-click booking
│   └── bookings/            # Member's active passes & cancel modal
├── (trainer)/trainer/       # Trainer assigned classes & live attendance check-in
└── (platform)/admin/        # Super Admin SaaS tenant orchestration
```

### 2. State & Styling Highlights
- **Global Auth Store**: Redux Toolkit (`authSlice`) storing serialized user identities, organization context, and JWT access tokens.
- **Dark Glassmorphism**: Tailored backdrop blurs (`backdrop-blur-xl`), athletic neon accents (Flame Orange `#FF5722`, Electric Emerald `#10B981`, Cyber Cyan `#06B6D4`), and subtle radial glow meshes.
- **Resilient API Layer**: [api.ts](file:///d:/ramjan/GymFlow/frontend/src/lib/api.ts) automatically attaches bearer authentication and displays clear diagnostic alerts if network boundaries are unreachable.

---

## 📖 Swagger API Documentation

Interactive OpenAPI 3.0 documentation is live at:  
👉 **[https://gymflow-88r1.onrender.com/api/docs](https://gymflow-88r1.onrender.com/api/docs)**

### Key Endpoint Groups

| Module | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new gym organization or member account | Public |
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate user and return dual JWT tokens | Public |
| **Auth** | `POST` | `/api/v1/auth/refresh` | Rotate refresh token and issue new access token | Public |
| **Classes** | `GET` | `/api/v1/classes` | Fetch class catalog for active organization | Optional |
| **Classes** | `POST` | `/api/v1/classes` | Create new fitness program | `GYM_OWNER`, `GYM_ADMIN` |
| **Branches** | `GET` | `/api/v1/branches` | List all physical gym locations and rooms | Authenticated |
| **Sessions** | `GET` | `/api/v1/sessions` | List scheduled class sessions with seat counts | Authenticated |
| **Bookings** | `POST` | `/api/v1/bookings` | Book class session with row-level concurrency lock | `MEMBER` |
| **Attendance** | `POST` | `/api/v1/attendance/check-in` | Mark trainee present for session | `TRAINER`, `STAFF` |
| **Upload** | `POST` | `/api/v1/upload/image` | Upload base64 image asset to Cloudinary CDN | Authenticated |
| **Dashboard** | `GET` | `/api/v1/dashboard/overview` | Executive KPI analytics & branch capacity | `GYM_OWNER` |
| **Dashboard** | `GET` | `/api/v1/dashboard/superadmin` | Global SaaS tenant overview | `SUPER_ADMIN` |

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+ or v20+)
- PostgreSQL database (or free Neon serverless account)
- Cloudinary account

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
- **Local API**: `http://localhost:4000/api/v1`
- **Local Swagger**: `http://localhost:4000/api/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- **Local Frontend**: `http://localhost:3000`

---

## 🔒 Environment Variables Reference

### Backend (`backend/.env`)
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://<user>:<password>@<host>/neondb?sslmode=require"
JWT_SECRET="gymflow_enterprise_access_jwt_secret_token_2026"
JWT_REFRESH_SECRET="gymflow_enterprise_refresh_jwt_secret_token_2026"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="ramjan"
CLOUDINARY_API_KEY="839226347835865"
CLOUDINARY_API_SECRET="<your_api_secret>"
CLOUDINARY_UPLOAD_PRESET="voltix"

# CORS
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://gymflow-88r1.onrender.com/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ramjan
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=voltix
```

---

## 📦 Clean Repository Structure

```
GymFlow/
├── backend/                       # NestJS API Gateway (Prisma, PostgreSQL, JWT, Swagger)
│   ├── prisma/schema.prisma       # 33 relational PostgreSQL entities
│   ├── src/
│   │   ├── modules/               # Domain business modules
│   │   ├── common/                # Guards, decorators, types
│   │   └── database/              # PrismaService & seed script
│   └── package.json
├── frontend/                      # Next.js 14 App Router (Tailwind CSS, Redux, Lucide)
│   ├── src/
│   │   ├── app/                   # 5 Portal route groups
│   │   ├── components/            # Luxury athletic dark UI components
│   │   ├── store/                 # Redux Toolkit state
│   │   └── lib/                   # API communication layer
│   └── package.json
└── README.md                      # Comprehensive Architecture & Deployment Guide
```

---

## 👨‍💻 Author & Maintainer

Architected and developed by **[Md Ramjan Ali](https://github.com/Ramjanict)**  
📧 Contact: `mdramjan.ict@gmail.com`  
🐙 GitHub: [https://github.com/Ramjanict](https://github.com/Ramjanict)
