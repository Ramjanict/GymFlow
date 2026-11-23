# GymFlow — Database Schema & Entity Relationships

The GymFlow database is hosted on Neon PostgreSQL with 33 core entities:

### Entity Breakdown

1. **Identity & Tenant**:
   - `Organization`: Root tenant entity with slug, status, logo, and relations.
   - `User`: Global unique identity with optional `organizationId`.
   - `Role`: Organization-scoped and platform-scoped RBAC roles.
   - `Permission`: Granular capabilities (e.g. `booking.create`, `attendance.create`).
   - `UserRole`, `RolePermission`: Mapping tables.
   - `RefreshToken`: Hashed rotating refresh tokens.

2. **Facilities & Staff**:
   - `Branch`: Physical gym locations (`Mirpur`, `Gulshan`) with timezone and city.
   - `Room`: Studios inside branches (e.g. `Studio A - Yoga Sanctuary`).
   - `BranchStaff`: Staff assignment per branch.
   - `TrainerProfile`: Bio, specialties, hourly rate.
   - `TrainerBranch`: Multi-branch trainer assignments.
   - `MemberProfile`: Member emergency contacts, subscriptions, and bookings.

3. **Classes & Scheduling**:
   - `ClassCategory`: Yoga, HIIT, Strength, Pilates.
   - `FitnessClass`: Duration, capacity, level, Cloudinary cover photo.
   - `ClassSchedule`: Recurrence rules and weekly day patterns.
   - `ClassSession`: Concrete occurrence with UTC timestamps, capacity, and `bookedCount`.
   - `SessionTrainer`: Trainers conducting occurrences.

4. **Booking, Waitlist & Attendance**:
   - `ClassBooking`: Status (`CONFIRMED`, `WAITLISTED`, `CANCELLED`, `ATTENDED`, `NO_SHOW`).
   - `WaitlistEntry`: Sequential queue with unique `(sessionId, position)`.
   - `Attendance`: Check-in verification timestamp and staff auditor.

5. **Memberships & SaaS Billing**:
   - `MembershipPlan`: Duration, price, booking limits, eligible branches.
   - `MembershipBranch`: Multi-branch plan entitlements.
   - `Subscription`: Active member plan subscription.
   - `Payment`: Transaction ID, amount, provider (`BKASH`, `STRIPE`), status.
   - `PlatformPlan`, `OrganizationSubscription`: SaaS B2B billing for GymFlow platform.
