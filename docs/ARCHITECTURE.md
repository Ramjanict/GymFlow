# GymFlow — Full Production Architecture Document

## 1. Multi-Tenant Organization Boundary

GymFlow follows a shared database, shared schema multi-tenancy model with strict `organizationId` scoping:
- **Tenant (`Organization`)**: Represents the gym business (e.g. FitZone Global Fitness).
- **Physical Locations (`Branch`)**: Represents branches (Mirpur, Gulshan). Branches are physical gym assets, NOT separate tenants.
- **Data Isolation**: All tenant-owned tables (`FitnessClass`, `ClassSession`, `ClassBooking`, `MembershipPlan`, `Subscription`, `Payment`) enforce `organizationId`.
- **TenantGuard**: Inspects `X-Organization-Id` or user's session organization, asserting that non-super-admin users cannot read or mutate another tenant's data.

---

## 2. Concurrency Booking Model

Overbooking is completely prevented using PostgreSQL transactional row-level locks:
```typescript
await tx.$queryRaw`SELECT * FROM "ClassSession" WHERE id = ${sessionId} FOR UPDATE`;
```
1. Checks current `bookedCount < capacity`.
2. Verifies member subscription validity and duplicate booking.
3. If capacity is exhausted, immediately assigns a sequential waitlist position.
4. If a cancellation occurs, the waitlist queue automatically promotes the #1 waitlisted member.

---

## 3. Technology Stack

- **Backend**: NestJS, TypeScript, Prisma ORM, Passport JWT, Swagger UI
- **Database**: PostgreSQL on Neon Cloud
- **Frontend**: Next.js 14 App Router, Tailwind CSS, Redux Toolkit, Lucide React
- **Media CDN**: Cloudinary (`ku04x3pn`)
- **Package Manager**: pnpm Workspaces
