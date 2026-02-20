# CIB Records & Appointment Portal

A full-stack appointment booking and management system built with Next.js 16, Supabase, and Tailwind CSS.

## Overview

This portal allows public users to schedule appointments for various CIB services, while authenticated administrators can manage, approve, and track all appointments through a protected dashboard.

## Features

### Public Pages
- **Home Page** (`/`) - Landing page with service overview, how-it-works steps, and quick links
- **Book Appointment** (`/book`) - Full booking form with validation for scheduling appointments
- **Booking Confirmation** (`/book/success`) - Success page shown after submitting an appointment

### Admin Pages (Protected)
- **Admin Login** (`/auth/login`) - Supabase Auth login with email & password
- **Admin Dashboard** (`/admin`) - View, filter, search, and manage all appointments
  - Stats overview cards (Total, Pending, Approved, Completed)
  - Searchable & filterable appointments table
  - Inline status updates (Pending / Approved / Completed / Cancelled)
  - Sign-out functionality

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Validation:** Zod + React Hook Form
- **Data Fetching:** SWR

## Database Schema

### `appointments` table

| Column             | Type        | Description                                      |
|--------------------|-------------|--------------------------------------------------|
| `id`               | UUID        | Primary key (auto-generated)                     |
| `full_name`        | TEXT        | Applicant's full name                            |
| `member_id`        | TEXT        | Member / employee ID                             |
| `email`            | TEXT        | Contact email                                    |
| `phone`            | TEXT        | Contact phone number                             |
| `service_type`     | TEXT        | Type of service requested                        |
| `appointment_date` | DATE        | Requested appointment date                       |
| `appointment_time` | TIME        | Requested appointment time                       |
| `notes`            | TEXT        | Optional additional notes                        |
| `status`           | TEXT        | Appointment status (default: "Pending")          |
| `created_at`       | TIMESTAMPTZ | Timestamp of when the appointment was created    |

### Row Level Security (RLS)

- **Public users** can insert (book) appointments
- **Authenticated users** (admins) can select, update, and delete appointments

## Admin Credentials

| Field    | Value            |
|----------|------------------|
| Email    | admin@cib.gov    |
| Password | admin123456      |

> **Important:** Change the admin password after first login for security.

## Available Services

- ID Card Replacement
- Transcript Request
- Record Verification
- Document Certification
- Background Check
- General Inquiry

## Project Structure

```
app/
  page.tsx                        # Home page
  layout.tsx                      # Root layout with Navbar
  book/
    page.tsx                      # Booking form page
    success/page.tsx              # Booking success page
  auth/
    login/page.tsx                # Admin login page
    error/page.tsx                # Auth error page
  admin/
    page.tsx                      # Admin dashboard (server component)
    admin-dashboard-client.tsx    # Dashboard client wrapper
  api/
    appointments/
      route.ts                   # GET all appointments
      [id]/route.ts              # PATCH update appointment status
components/
  navbar.tsx                      # Navigation bar
  booking-form.tsx                # Appointment booking form
  login-form.tsx                  # Admin login form
  appointments-table.tsx          # Admin appointments table
lib/
  supabase/
    client.ts                     # Browser Supabase client
    server.ts                     # Server Supabase client
    middleware.ts                 # Supabase middleware helpers
middleware.ts                     # Root middleware (protects /admin)
```

## Environment Variables

The following environment variables are required (automatically configured via the Supabase integration):

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
