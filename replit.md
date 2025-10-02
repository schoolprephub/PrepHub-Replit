# PrepHub - IIT Preparation Platform

## Overview

PrepHub is a comprehensive school management and IIT preparation platform built as a React single-page application. The system provides interactive learning features including attendance tracking, library management with videos and study materials, gamified learning experiences, and administrative controls. The application supports both traditional Supabase-authenticated users and mobile-first users who authenticate via folder-based sessions stored in localStorage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18.3** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured for SWC-based fast refresh
- **React Router** for client-side routing with dedicated routes for user and admin flows

**UI Component System**
- **Shadcn UI** components built on Radix UI primitives for accessible, customizable interface elements
- **Tailwind CSS** with custom design system featuring:
  - Custom color palette optimized for educational platforms (vibrant primary colors, accent colors)
  - CSS custom properties for theme variables
  - Mobile-responsive design with breakpoint system
- **Component structure** follows atomic design with shared UI components in `/components/ui`

**State Management**
- **React Context API** for authentication state (`AuthContext`) and admin state (`AdminContext`)
- **TanStack Query (React Query)** for server state management and caching
- **Local component state** using React hooks for UI interactions

**Design Patterns**
- Compound component pattern for complex UI elements (dialogs, forms, navigation)
- Higher-order context providers wrapping the application root
- Custom hooks for shared logic (toast notifications, mobile detection)

### Backend Architecture

**Backend-as-a-Service: Supabase**
- **Authentication**: Supabase Auth for standard user authentication
- **Database**: PostgreSQL via Supabase with custom tables:
  - `user_data`: User profiles and progress tracking
  - `daily_attendance`: Attendance records with date-based tracking
  - `folders`: Admin-created organizational units (tutoring centers)
  - `subfolders`: Sub-divisions within folders (classes/groups)
  - `folder_users`: Mobile users associated with folders (authenticate via mobile number + password)
  - `admins`: Admin users with elevated permissions

**Data Access Patterns**
- Service layer pattern: Dedicated service modules (`attendanceService.ts`) for database operations
- Type-safe database queries using Supabase client with TypeScript interfaces
- Local storage fallback for offline-capable features and mobile users

**Dual Authentication System**
The application supports two authentication modes:
1. **Supabase Auth**: Traditional email/password authentication for standard users
2. **Folder-based Mobile Auth**: Mobile number + password stored in `folder_users` table, session managed via localStorage

### Data Storage Solutions

**Primary Database: Supabase (PostgreSQL)**
- User profiles with study statistics (streaks, XP, progress)
- Attendance records with date tracking for streak calculations
- Hierarchical folder structure (admins → folders → subfolders → users)
- Relational data with foreign key constraints

**Local Storage**
- User session persistence (`folder_user_session` for mobile users)
- Cached user data for offline functionality
- Mobile user attendance records (`mobile_user_attendance`)
- Temporary UI state (preferences, recent interactions)

**Storage Utility Layer**
- Abstracted storage operations in `lib/storage.ts` and `lib/supabaseStorage.ts`
- Automatic refresh callbacks for real-time UI updates after data mutations
- Type-safe storage keys and data structures

### Authentication & Authorization

**User Authentication Flow**
1. Standard users: Email/password via Supabase Auth → session management via Supabase
2. Mobile users: Mobile number/password lookup in `folder_users` → localStorage session token
3. Session persistence across page reloads using localStorage checks

**Admin Authentication**
- Separate admin login route (`/admin/login`)
- Admin credentials verified against `admins` table
- Admin session stored independently in localStorage
- Protected admin routes with context-based access control

**Authorization Patterns**
- Route-level protection using React Router guards
- Context-based role checking (regular user vs admin)
- Component-level conditional rendering based on auth state

### Route Structure

**Public Routes**
- `/` - Landing page with hero and features
- `/login` - User authentication (mobile-first)
- `/admin/login` - Admin authentication

**Protected User Routes**
- `/dashboard` - Main user dashboard with progress tracking
- `/library` - Learning resources (videos, materials, quizzes, games)
- `/attendance` - Attendance tracking interface

**Protected Admin Routes**
- `/admin/dashboard` - Admin control panel with folder/user management

**Fallback**
- `*` - 404 Not Found page with error logging

### Key Features & Design Decisions

**Gamification System**
- Study streaks with fire emoji progression (💪 → 🌟 → ⚡ → 🔥)
- XP points for completed lessons
- Achievement badges stored in user profiles
- Visual progress indicators throughout the application

**Attendance System**
- Date-based attendance marking (one per day)
- Streak calculation based on consecutive days
- Calendar UI for viewing attendance history
- Automatic streak breaking on missed days

**Mobile-First Considerations**
- Responsive design with mobile breakpoints
- Touch-friendly UI components
- Offline-capable localStorage-based authentication
- Mobile number as primary identifier for folder users

**Performance Optimizations**
- Code splitting via React Router route-based chunks
- Lazy loading for heavy components
- TanStack Query caching to reduce API calls
- Vite's optimized build pipeline with tree-shaking

## External Dependencies

### Core Infrastructure
- **Supabase** (`@supabase/supabase-js` v2.57.4): Backend-as-a-Service providing PostgreSQL database, authentication, and real-time subscriptions

### UI Framework & Styling
- **Radix UI**: Headless accessible component primitives (accordion, dialog, dropdown, select, etc.)
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Shadcn UI**: Pre-built component library based on Radix UI and Tailwind

### State Management & Data Fetching
- **TanStack Query** v5.83.0: Server state management, caching, and synchronization
- **React Hook Form** with Zod validation: Form state management with type-safe validation

### Routing
- **React Router**: Client-side routing with protected routes and navigation

### Utilities
- **date-fns** v3.6.0: Date manipulation and formatting
- **lucide-react**: Icon library
- **clsx** & **class-variance-authority**: Dynamic className management
- **cmdk**: Command palette component

### Development Tools
- **Vite**: Build tool with fast HMR
- **TypeScript**: Type safety (configured with relaxed linting for rapid development)
- **ESLint**: Code linting with React-specific rules

### Design System Fonts
- **Google Fonts**: Inter and Poppins for educational, friendly typography

### Notable Configuration Decisions
- TypeScript strict mode disabled for faster development iteration
- Unused variables/parameters linting disabled to reduce noise
- Custom Vite configuration for Replit deployment (host, port, HMR settings)
- PostCSS with Autoprefixer for CSS compatibility