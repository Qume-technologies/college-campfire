# College Campfire

PROJECT: PREMIUM MULTI-TENANT COLLEGE MANAGEMENT SAAS PLATFORM

Act as a world-class SaaS product architect, senior full-stack engineer, database architect, UI/UX designer, and security engineer.

Build a complete, production-oriented, premium College Management SaaS platform. This platform will serve multiple independent colleges, each with its own administration, staff, teachers, academic data, branding, and permissions.

IMPORTANT: This is NOT a student portal. We already have an existing Flutter college mobile application used by students. This website is the management and administration platform that controls the data consumed by that existing mobile application.

The website and mobile application must eventually work together through the same Supabase backend.

The priority is to create a beautiful, highly functional, scalable, secure, multi-tenant SaaS product with a sophisticated enterprise-level user experience.

1. TECHNOLOGY STACK

Use the following technologies:

Frontend: React + TypeScript.

Build tool: Vite.

Styling: Tailwind CSS.

UI components: shadcn/ui.

Icons: Lucide.

Backend: Supabase.

Database: PostgreSQL.

Authentication: Supabase Auth.

File storage: Supabase Storage.

Data fetching: TanStack Query.

Forms: React Hook Form + Zod.

Charts: Recharts.

Routing: React Router.

Use clean, modular, reusable components and a maintainable folder structure.

Use Supabase as the actual backend, not localStorage or mock APIs.

Do not expose Supabase service-role keys or other privileged secrets in frontend code.

2. EXISTING DATABASE — CRITICAL REQUIREMENT

I will provide an existing SQL schema from our Flutter college APK.

The schema contains these existing tables:

profiles

attendance

timetable

assignments

notices

notifications

fees

exams

results

leave_notes

It also contains database functions, triggers, indexes, views, RLS policies, storage buckets, and sample records.

IMPORTANT DATABASE INSTRUCTIONS:

Thoroughly inspect the supplied SQL schema before implementing database-related functionality.

Preserve existing table names and existing mobile application functionality.

Do not arbitrarily rename, remove, or replace existing tables or columns.

Do not recreate the entire database from scratch.

Design new database migrations that extend the existing schema.

Keep the mobile application compatible with the database changes.

Introduce the required multi-tenant architecture using college_id relationships.

Ensure every college-specific record belongs to the correct college.

Maintain referential integrity through foreign keys and appropriate indexes.

Create safe, migration-based changes instead of destructive modifications.

The existing schema is primarily student-facing. Extend it with the missing SaaS, authentication, employee, staff, teacher, academic administration, and permissions functionality.

Do not assume the existing profiles table is sufficient for all account types.

3. MULTI-TENANT SAAS ARCHITECTURE

This is the foundation of the entire project.

The platform must support multiple colleges using one SaaS infrastructure.

Each college must have completely isolated data.

Create a proper college registration and management system.

College registration should collect:

College name.

College logo.

College cover image.

College email.

Contact number.

Address.

City.

Province/state.

Country.

Website.

Registration or affiliation number.

College description.

College type.

Other configurable institutional details.

Each college receives:

A unique UUID.

A unique college identifier.

A unique slug.

Its own branding configuration.

Its own departments.

Its own staff and teachers.

Its own academic records.

Its own permissions configuration.

Its own mobile application data.

Create appropriate tables for:

colleges

college_settings

college_subscriptions

college_domains (if required)

college_integrations

Create college onboarding with a clear verification and activation workflow.

A college should not automatically receive unrestricted platform access simply by submitting a registration form.

Support statuses such as:

Pending

Under Review

Approved

Suspended

Rejected

A college should have access to its dashboard only after the appropriate activation process.

4. AUTHENTICATION AND ACCOUNT ARCHITECTURE

Implement a secure authentication system.

There are two main authentication experiences:

A. SaaS platform authentication:

Super Admin login.

SaaS administration.

B. College authentication:

College administrator login.

Staff login.

Teacher login.

Students must NOT be able to log into this website.

Use Supabase Auth for all user authentication.

Never store plaintext passwords in database tables.

Create a secure account architecture using:

auth.users

user_profiles

college_memberships

roles

permissions

role_permissions

user_roles

Each authenticated college user must be associated with a college.

A user must never be able to switch into another college's data by modifying a URL, request, or client-side identifier.

Support account invitation, password reset, secure session management, account activation, deactivation, and sign-out.

5. DYNAMIC ROLE AND PERMISSION MANAGEMENT

This is one of the most important features.

Do not hardcode permissions into the frontend.

Create a fully dynamic role and permission management system.

The Super Admin can manage platform-level access.

College administrators can create and manage college-level roles and permissions, subject to their authority.

Suggested default roles:

College Administrator

Principal

Vice Principal

Academic Coordinator

Department Head

Accountant

Receptionist

HR Manager

Teacher

Custom Role

Allow colleges to create unlimited custom roles within their subscription limits.

Create a professional permissions management interface.

Organize permissions by module:

DASHBOARD

View dashboard

View analytics

STUDENTS

View students

Add students

Edit students

Delete students

Import students

Export students

ATTENDANCE

View attendance

Mark attendance

Edit attendance

View attendance reports

TIMETABLE

View timetable

Create timetable

Edit timetable

Delete timetable

ASSIGNMENTS

View assignments

Create assignments

Edit assignments

Delete assignments

NOTICES

View notices

Publish notices

Edit notices

Delete notices

EXAMS AND RESULTS

Manage exams

Enter marks

Publish results

View results

FEES

View fees

Create fee records

Record payments

View financial reports

STAFF

View staff

Add staff

Edit staff

Manage staff accounts

TEACHERS

View teachers

Manage teacher assignments

SETTINGS

Manage college settings

Manage departments

Manage academic sessions

Manage roles

Manage permissions

Include:

Module-based permission groups.

Select all permissions.

Individual permission toggles.

Create role.

Edit role.

Duplicate role.

Delete role with safeguards.

Assign role to user.

Multiple roles where appropriate.

Permission preview.

Permission-based navigation.

Permission-based page access.

Permission-based action visibility.

Permissions must be enforced on the backend through database policies and secure server-side operations, not merely by hiding buttons.

6. SUPER ADMIN DASHBOARD

Create a completely separate SaaS administration dashboard.

The Super Admin manages the entire platform.

Dashboard overview cards:

Total registered colleges.

Active colleges.

Pending college applications.

Suspended colleges.

Total staff accounts.

Total teacher accounts.

Total students across colleges.

Platform activity.

Include:

COLLEGE MANAGEMENT

Create a beautiful college management interface.

Display colleges in a professional searchable table and card layout.

Each college should have:

Logo.

Name.

College ID.

Registration date.

Status.

Contact information.

Subscription status.

Actions:

View college details.

Approve college.

Reject application.

Suspend college.

Reactivate college.

Edit college information.

View college activity.

Manage subscription.

Add search, filtering, sorting, and pagination.

PLATFORM MANAGEMENT

Manage SaaS users.

Manage platform roles.

Manage platform permissions.

Manage subscription plans.

View platform-wide analytics.

Manage integrations.

View audit logs.

Manage platform settings.

7. COLLEGE ADMINISTRATION DASHBOARD

After a college administrator signs in, show their own college dashboard.

The dashboard should dynamically use the authenticated user's college information.

Create an impressive overview containing:

Total students.

Total staff.

Total teachers.

Total departments.

Active academic session.

Today's attendance.

Pending leave applications.

Upcoming examinations.

Active assignments.

Recent notices.

Recent activity.

Charts:

Attendance trends.

Department-wise student distribution.

Monthly attendance.

Academic performance overview.

Add quick actions:

Add student.

Add teacher.

Add staff.

Mark attendance.

Create assignment.

Publish notice.

Schedule examination.

Create timetable.

Only display actions permitted by the current user's permissions.

8. STUDENT MANAGEMENT

Although students will not log into this website, authorized staff must be able to manage student records that are consumed by the mobile application.

Use the existing profiles table as the foundation.

Create a complete student management interface.

Features:

Student listing.

Search by name.

Search by student ID.

Filter by department.

Filter by admission year.

Filter by section.

Add student.

Edit student.

View student profile.

Update contact information.

Upload profile picture.

Import students through CSV.

Export student records.

Maintain compatibility with the existing student_id, full_name, department, email, phone, admission_year, room_no, and avatar_url fields.

9. STAFF AND TEACHER MANAGEMENT

Create separate management modules for staff and teachers.

STAFF MANAGEMENT:

Staff directory.

Staff profile.

Employee ID.

Name.

Email.

Phone.

Department.

Designation.

Joining date.

Employment status.

Profile photo.

Assigned roles.

Account status.

TEACHER MANAGEMENT:

Teacher directory.

Teacher profile.

Employee ID.

Name.

Email.

Contact number.

Department.

Designation.

Assigned subjects.

Assigned classes.

Assigned sections.

Timetable.

Account permissions.

Teachers should be able to log into their own accounts and access only their assigned and authorized modules.

Create secure invitation and account activation workflows.

10. ACADEMIC MANAGEMENT

Build the management interfaces around the existing mobile application schema.

ATTENDANCE

Monthly attendance.

Daily attendance.

Student-wise attendance.

Class-wise attendance.

Department-wise attendance.

Attendance correction.

Attendance reports.

Present, absent, late and leave statuses.

Attendance percentage.

Preserve compatibility with the existing attendance table and monthly aggregate functionality.

TIMETABLE

Weekly timetable.

Daily timetable.

Department-wise timetable.

Class-wise timetable.

Teacher assignment.

Room assignment.

Create, edit and delete schedule entries.

Preserve the existing timetable fields and day-of-week conventions.

ASSIGNMENTS

Create assignment.

Select subject.

Select department.

Select batch.

Select section.

Set due date.

Add description.

Upload attachments.

View published assignments.

Plan for assignment submissions and teacher grading as additional database functionality.

NOTICES

Publish notices.

Edit notices.

Delete notices.

Target entire college.

Target departments.

Target individual classes or sections.

Schedule notices where supported.

EXAMINATIONS

Create examinations.

Set examination type.

Configure start and end dates.

Assign departments.

Manage examination schedules.

RESULTS

Enter subject marks.

Manage GPA and grades.

Publish results.

View student academic performance.

Generate reports.

FEES

Create fee records.

Set fee amounts.

Configure due dates.

Mark payments.

View pending fees.

View paid fees.

Generate payment reports.

Plan for payment transaction history and receipts.

LEAVE MANAGEMENT

View leave applications.

Filter by status.

Approve leave.

Reject leave.

Add administrative replies.

View student leave history.

11. NOTIFICATIONS AND MOBILE APP INTEGRATION

This website is the management interface for the existing Flutter mobile APK.

Both applications must use the same college-specific database records.

For example:

A teacher logs into the website.

The teacher marks student attendance.

The attendance data is saved in Supabase.

The Flutter mobile application retrieves the updated attendance.

The student sees the updated attendance.

Apply this same architecture to:

Notices.

Assignments.

Timetables.

Examinations.

Results.

Fees.

Notifications.

Leave application responses.

Use Supabase Realtime where appropriate.

Use secure database queries and tenant-aware APIs.

Do not build a second disconnected database for the website.

Do not modify the Flutter application's expected data structures without a planned compatibility migration.

For notifications, plan integration with push notification services such as Firebase Cloud Messaging if required by the existing mobile application.

12. COLLEGE SETTINGS

Every college should have a dedicated settings area.

Include:

College profile.

Logo and branding.

Contact details.

Departments.

Academic sessions.

Courses and subjects.

Classes and sections.

Rooms.

Staff settings.

Teacher settings.

Account settings.

Role settings.

Permission settings.

Notification settings.

Mobile application integration settings.

Allow college administrators to configure their institution without affecting other colleges.

13. SAAS SUBSCRIPTION ARCHITECTURE

Prepare the system for commercial SaaS operation.

Create subscription management infrastructure.

Suggested plans:

Free Trial.

Basic.

Professional.

Enterprise.

Allow configurable limits for:

Number of students.

Number of staff.

Number of teachers.

Storage.

Available modules.

Number of administrators.

Include:

Subscription status.

Billing period.

Start date.

Renewal date.

Trial expiration.

Upgrade and downgrade workflow.

Prepare the architecture for payment gateway integration, but do not invent live payment credentials or claim payments are functional without a real provider integration.

14. SECURITY AND DATA ISOLATION

Security is mandatory.

Implement proper PostgreSQL Row Level Security.

Every college-owned record must have a college_id or be securely linked through an ownership relationship.

Policies must verify the authenticated user's actual college membership and permissions.

Requirements:

No cross-college data access.

No unrestricted public database policies.

No plaintext password storage.

No client-side permission enforcement as the only security measure.

No exposed service-role keys.

Secure file upload policies.

Proper validation of all user inputs.

Secure account invitations.

Audit logging for sensitive operations.

Protection against unauthorized role escalation.

Review and replace the existing unrestricted public RLS policies carefully while preserving compatibility with the APK.

Use a migration plan for any mobile application authentication changes.

15. AUDIT LOGS

Create an audit logging system.

Record important actions such as:

User login.

Account creation.

Student record changes.

Attendance modifications.

Result publication.

Fee updates.

Permission changes.

Staff account changes.

College configuration changes.

Store:

User ID.

College ID.

Action.

Module.

Record reference.

Timestamp.

Relevant change metadata.

Audit logs should be accessible according to permissions.

16. PREMIUM UI/UX DESIGN SYSTEM

The design must feel like a premium international SaaS product.

Take inspiration from the quality and usability of products such as Linear, Stripe Dashboard, Vercel, and modern enterprise management platforms.

Do not directly copy their interfaces.

DESIGN DIRECTION:

Modern.

Minimal.

Elegant.

Professional.

Premium.

Clean.

Highly organized.

Enterprise-grade.

COLOR SYSTEM:

Use a sophisticated light theme:

Deep navy for primary navigation.

White and soft neutral backgrounds.

Subtle blue accents.

Muted gray typography.

Carefully selected green, orange, and red for statuses.

Typography:

Use Inter or a similar premium modern sans-serif font.

LAYOUT:

Create a responsive application shell with:

LEFT SIDEBAR:

Brand logo.

Navigation groups.

Expandable navigation.

Active navigation indicators.

Collapsible sidebar.

User account section.

TOP HEADER:

Breadcrumbs.

Global search.

Notifications.

Help access.

Profile dropdown.

Current college selector where applicable and authorized.

MAIN CONTENT:

Clear page titles.

Descriptive subtitles.

Statistics cards.

Charts.

Tables.

Filters.

Action buttons.

Proper spacing.

Use:

Beautiful data tables.

Consistent card designs.

Subtle shadows.

Soft borders.

Refined rounded corners.

Smooth transitions.

Elegant dropdowns.

Well-designed modals.

Professional form layouts.

Skeleton loading states.

Empty states.

Error states.

Toast notifications.

Avoid:

Excessive gradients.

Overly colorful dashboards.

Unnecessary animations.

Huge decorative cards.

Generic template-looking interfaces.

Cluttered layouts.

The interface must feel like a serious commercial SaaS product.

17. RESPONSIVENESS

The platform must work beautifully on:

Desktop computers.

Laptops.

Tablets.

Mobile browsers.

Prioritize desktop usability for administration while making the responsive experience fully functional.

Tables should adapt intelligently to smaller screens.

Forms and modals must remain usable on mobile devices.

18. SEARCH, FILTERING AND DATA MANAGEMENT

Implement reusable search and filtering functionality.

Support:

Global search where appropriate.

Table search.

Department filtering.

Date filtering.

Status filtering.

Sorting.

Pagination.

CSV import.

CSV export.

Bulk actions with permission checks.

All data tables should support loading, empty, error, and success states.

19. APPLICATION ROUTES

Create a logical route structure.

PUBLIC:

/

/login

/register-college

/forgot-password

/verify-college

SUPER ADMIN:

/super-admin/dashboard

/super-admin/colleges

/super-admin/colleges/

/super-admin/users

/super-admin/subscriptions

/super-admin/roles

/super-admin/audit-logs

/super-admin/settings

COLLEGE APPLICATION:

/college/dashboard

/college/students

/college/staff

/college/teachers

/college/departments

/college/attendance

/college/timetable

/college/assignments

/college/notices

/college/exams

/college/results

/college/fees

/college/leave-management

/college/notifications

/college/roles

/college/permissions

/college/settings

Protect routes using authentication, college membership, and dynamic permission checks.

20. DEVELOPMENT AND IMPLEMENTATION RULES

This is a real software product, not a static design prototype.

Follow these rules:

Build reusable components.

Use real Supabase database operations.

Create proper loading and error handling.

Validate forms.

Protect all routes.

Enforce permissions.

Avoid duplicated logic.

Maintain clean TypeScript types.

Use proper database migrations.

Never expose privileged credentials.

Never silently create fake functionality.

Do not use hardcoded dashboard statistics when real database data is expected.

Do not use placeholder buttons that do nothing.

Do not use localStorage as a replacement for database persistence.

Keep the existing Flutter APK compatible.

If Supabase credentials or integrations are not yet configured, build the integration architecture and clearly identify what needs configuration. Never pretend that a database operation has succeeded when it has not.

21. IMPLEMENTATION PRIORITIES

Build the product in a structured order.

PHASE 1:

Project architecture.

Design system.

Public landing page.

Authentication.

College registration.

Multi-tenant database foundations.

Super Admin dashboard.

PHASE 2:

College dashboard.

Staff management.

Teacher management.

Roles and permissions.

Student management.

PHASE 3:

Attendance.

Timetable.

Assignments.

Notices.

Exams.

Results.

Fees.

Leave management.

Notifications.

PHASE 4:

APK integration.

SaaS subscriptions.

Audit logs.

Analytics.

Security testing.

Responsive optimization.

Build incrementally. Do not compromise database integrity or existing application compatibility to make the UI appear complete.

22. FINAL QUALITY EXPECTATIONS

The finished product should look and feel like a premium SaaS platform that could be commercially launched and used by hundreds of colleges.

Every page should have consistent design quality.

Every dashboard should display relevant information.

Every button should have a meaningful action.

Every form should validate its input.

Every account should have appropriate access.

Every college's information must remain isolated.

The existing mobile application must remain compatible with the shared backend.

Before considering the project complete, review:

Database structure.

Multi-tenancy.

Authentication.

Authorization.

RLS policies.

Mobile application compatibility.

Responsive layouts.

Error handling.

Overall visual consistency.

Start by inspecting the supplied SQL schema, planning the database extensions, and establishing the core application architecture. Then build the actual application.

Do not sacrifice functionality for visual appearance, and do not sacrifice security for convenience.  creatte it complete okay?? complete frontend and u can keep mockdata andd if something remains u can add no woorry about sql

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b866a3b0-b3d2-4204-8d6d-4d074208b085).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
