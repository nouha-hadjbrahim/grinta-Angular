# GRINTA - Sports & Fitness Community Platform

> A comprehensive Angular 18 web application for fitness tracking, gym management, community challenges, and sports field booking.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Roles & Access Control](#roles--access-control)
- [API](#api)
- [Key Integrations](#key-integrations)
- [Team](#team)

---

## Overview

**GRINTA** is a full-stack sports and fitness community platform. The frontend is built with Angular 18 and connects to a Spring Boot backend. It serves four types of users — regular members, coaches, gym managers, and administrators — each with their own dedicated portal and feature set.

---

## Features

### For Members
- **Workouts** — Browse AI-generated training programs, track exercises, log performance, unlock achievements, and follow a workout calendar
- **AI Pose Coach** — Real-time pose detection using MediaPipe and Three.js for guided workout sessions
- **Nutrition** — Build meal plans, scan ingredients, and track calorie goals
- **Community** — Join groups, participate in challenges, climb leaderboards, earn points and badges
- **Events** — Discover, register for, and attend sports events; receive QR-code tickets; chat with an event bot
- **Bookings** — Reserve sports fields and courts, pay via Stripe or crypto
- **Gyms** — Browse gyms, view details, rate facilities, and file complaints

### For Coaches
- Coach registration and profile
- Manage coaching sessions and view statistics
- Apply for gym job postings

### For Gym Managers
- Gym planning and class scheduling
- Subscription plan management
- Review and complaint handling
- Coach and job post management

### For Admins (Back-office)
- Full CRUD over users, gyms, workouts, nutrition, events, community, bookings, and subscriptions
- Equipment and terrain management
- Leaderboard and challenge moderation
- Real-time dashboard with platform statistics

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Angular 18.2 |
| UI | Bootstrap 5.3, Angular Material 18 |
| State / Async | RxJS 7.8 |
| Real-Time | STOMP over WebSocket (SockJS) |
| Maps | Leaflet 1.9 |
| Calendar | FullCalendar 6.1 |
| Charts | Chart.js 4.5 |
| AI / CV | MediaPipe Pose, Three.js |
| Payments | Stripe, Ethers.js (crypto) |
| QR Codes | ZXing Scanner, angularx-qrcode |
| PDF | jsPDF + autotable |
| Animations | GSAP 3.15 |
| Alerts | SweetAlert2 |
| Auth | JWT Bearer tokens, Google OAuth, Facebook OAuth |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 18: `npm install -g @angular/cli@18`
- Spring Boot backend running on `http://localhost:8000`

### Installation

```bash
# Clone the repository
git clone https://github.com/Mustapha-who/Grinta-angular.git
cd Grinta-angular

# Install dependencies
npm install

# Start development server
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Build for Production

```bash
ng build --configuration production
```

Output is in the `dist/` directory.

---

## Project Structure

```
src/
├── app/
│   ├── features/                  # Feature modules by domain
│   │   ├── home/
│   │   ├── workouts/
│   │   ├── nutrition/
│   │   ├── community/
│   │   ├── events/
│   │   ├── bookings/
│   │   ├── gyms/
│   │   ├── coaching/
│   │   ├── profile/
│   │   ├── gym-manager/
│   │   ├── gym-job-offers/
│   │   └── backOffice/            # Admin portal (lazy-loaded)
│   ├── services/                  # Feature-scoped services
│   │   ├── auth/
│   │   ├── User/
│   │   ├── Workouts/
│   │   ├── Community/
│   │   ├── Booking/
│   │   ├── Events/
│   │   ├── Gyms/
│   │   ├── Nutrition/
│   │   └── ...
│   ├── guards/                    # AuthGuard, RoleGuard, CoachGuard, GymManagerGuard
│   ├── shared/                    # Shared components and pipes
│   ├── app-routing.module.ts
│   └── app.module.ts
├── assets/
│   ├── logo.png
│   ├── muscles/
│   ├── equipments/
│   ├── badges/
│   └── ...
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## Environment Configuration

Create or update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
  facebookAppId: 'YOUR_FACEBOOK_APP_ID',
  stripePublishableKey: 'YOUR_STRIPE_KEY'
};
```

---

## Roles & Access Control

| Role | Guard | Access |
|---|---|---|
| Guest | — | Sign-in, Sign-up, Public ticket view |
| Member | `AuthGuard` | All member features |
| Coach | `CoachGuard` | Coaching portal, gym job offers |
| Gym Manager | `GymManagerGuard` | Gym manager portal |
| Admin | `RoleGuard` | Full back-office (lazy-loaded) |

---

## API

The frontend communicates with a Spring Boot REST API.

- **Base URL:** `http://localhost:8000/api`
- **Auth:** JWT Bearer token injected automatically via `AuthInterceptor`
- **Real-Time:** WebSocket endpoint at `/ws` using STOMP protocol

Key endpoint groups:

| Domain | Prefix |
|---|---|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Workouts / Programs | `/api/programs`, `/api/exercises` |
| Nutrition | `/api/nutrition` |
| Events | `/api/events` |
| Bookings / Terrains | `/api/bookings`, `/api/terrains` |
| Gyms | `/api/gyms` |
| Community | `/api/groups`, `/api/challenges`, `/api/leaderboard` |
| Coaching | `/api/coaching` |

---

## Key Integrations

### Stripe Payments
Field booking payments are processed client-side via Stripe. Set `stripePublishableKey` in the environment file.

### MediaPipe Pose Detection
Real-time workout coaching uses MediaPipe Pose in the browser with no server-side processing required.

### Leaflet Maps
Gym and event locations are displayed on interactive Leaflet maps with geocoding support.

### FullCalendar
Workout schedules and events are rendered using FullCalendar with day-grid and time-grid views.

### WebSocket (STOMP)
Real-time notifications for community rewards and challenge completions use a STOMP broker over SockJS.

---
