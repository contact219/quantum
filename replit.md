# Quantum Surety - AI-Powered Construction Surety Bond Platform

## Overview

Quantum Surety is a modern, AI-first surety bond agency specializing in construction bonds. The platform positions itself as "THE #1 AI-POWERED CONSTRUCTION SURETY BOND AGENCY" and provides fast, smart bonding solutions for contractors, general contractors, and subcontractors.

The application is built as a full-stack web platform with a React frontend and Express backend, featuring an AI-powered bond finder chatbot, multi-step quote forms, and comprehensive resources for construction professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: File-based routing using Wouter (lightweight client-side router)

**UI Component System**: 
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design system
- Design approach: Clean B2B SaaS patterns with modern visual treatments (gradients, bold hero sections)
- Typography: Inter font family throughout
- Color scheme: Indigo (primary), Teal/Emerald (accent), with semantic colors for states

**State Management**: 
- TanStack Query (React Query) for server state management
- React Hook Form with Zod validation for form handling
- Local component state for UI interactions

**Key Pages**:
- Home: Marketing landing page with bond category navigation
- Construction: Specialized construction bond finder with role/project size filtering
- AI Bond Finder: Conversational AI chatbot interface for bond recommendations
- Quote: Multi-step quote application form
- Portal: Client dashboard (separate from public layout)
- Admin: Quote management and approval interface
- Resources, FAQ, Glossary: Educational content pages

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**Development vs Production**:
- Development: Vite dev server with HMR middleware integration
- Production: Pre-built static assets served from dist/public

**API Structure**:
- RESTful endpoints under `/api` prefix
- Quote submission and retrieval (`/api/quotes`)
- AI chat interaction (`/api/ai/chat`)
- Company settings management (`GET /api/admin/settings`, `PATCH /api/admin/settings`) - admin only
- Endpoints return JSON responses with consistent error handling

**Request Handling**:
- JSON body parsing with raw body preservation for webhook support
- CORS and request logging middleware
- Request duration tracking for API endpoints

### Data Storage Solutions

**Database**: PostgreSQL via Neon serverless database

**ORM**: Drizzle ORM
- Schema definition in `shared/schema.ts` for type sharing between client/server
- Migration files in `./migrations` directory
- Type-safe database queries with Zod schema validation

**Current Storage Implementation**: 
- In-memory storage (`MemStorage` class) for development/demo
- Interface-based design (`IStorage`) allows easy swap to database implementation
- Data models: Users, Quotes, Bonds, Projects, ChatMessages

**Schema Design**:
- Users: Authentication and company information
- Quotes: Bond quote applications with business details, financial info, and status tracking
- Bonds: Issued bonds with penal sum, premium, dates, and project details
- Projects: Construction project tracking
- ChatMessages: AI conversation history with session management
- CompanySettings: Company contact information (name, phone, email, address, website) - editable via admin panel

### Authentication and Authorization

**Status**: ✅ **Production-Ready Multi-Layer Security Architecture**

**Implementation**: Replit Auth via OpenID Connect (Passport.js)
- Users can log in with Google, GitHub, X (Twitter), Apple, or email
- No API keys required - managed by Replit platform
- OAuth flow handled by `/api/login`, `/api/callback`, `/api/logout` endpoints

**Session Management**:
- PostgreSQL session store (connect-pg-simple)
- Sessions table stores authentication state
- Users table stores profile data from Replit Auth (id, email, firstName, lastName, profileImageUrl)
- Session serialization/deserialization via Passport

**Security Layers**:

1. **Server-Side Route Protection** (`server/routes.ts`)
   - Express middleware guards `/portal/*` and `/admin/*` routes
   - Returns 302 redirect to `/api/login` for unauthenticated requests
   - Protects against direct URL access and page refreshes

2. **Router-Level Guard** (`client/src/components/auth/ProtectedRoute.tsx`)
   - Wrapper component checks authentication before rendering protected pages
   - Handles SPA navigation via Wouter
   - Shows loading state while checking auth
   - Triggers full-page redirect with `window.location.assign('/api/login')` if unauthorized

3. **API Endpoint Protection**
   - All sensitive endpoints use `isAuthenticated` middleware
   - Protected: `/api/quotes`, `/api/bonds`, `/api/projects` (and admin variants)
   - User-specific data fetched using `req.user.claims?.sub` from session (not query params)
   - Public endpoints: `POST /api/quotes` (quote submission), `POST /api/ai/chat` (AI chatbot)

4. **Client-Side Utilities**
   - `useAuth()` hook provides authentication state
   - `/api/auth/user` endpoint returns user data (401 when not authenticated)
   - Navbar displays login/logout with user avatar dropdown

**Token Management**:
- `isAuthenticated` middleware includes token refresh logic
- Automatically refreshes expired tokens
- Handles authentication errors gracefully

**Admin Role-Based Access Control**:
- Admin role defined at user registration/creation
- Only users with `role: "admin"` can access `/admin` dashboard
- Admin endpoints require `isAdmin` middleware:
  - `GET /api/quotes` - view all quotes
  - `PATCH /api/quotes/:id/status` - update quote status
  - `PATCH /api/quotes/:id` - edit quote details
  - `DELETE /api/quotes/:id` - delete quote
  - `GET /api/bonds/all` - view all bonds
  - `GET /api/projects/all` - view all projects
- Frontend `ProtectedRoute` component enforces `requireAdmin` flag for `/admin` routes
- Non-admin users accessing admin endpoints receive 403 Forbidden response
- Admin panel includes print functionality for quotes and ability to delete quotes with confirmation dialog
- User portal bonds page includes print functionality for individual bonds

**Admin Username/Password Authentication**:
- Two separate authentication flows for admins:
  1. **OAuth (Replit Auth)**: Users can log in with Google, GitHub, X, Apple, or email (existing flow)
  2. **Username/Password Login**: Admin-only traditional username/password authentication
  
**Admin Setup Flow** (`/admin-setup`):
- First-time admin user creation endpoint
- Creates admin account with username and password
- Password is securely hashed using bcryptjs
- Only allows one admin user to be created (prevents multiple setup attempts)
- Redirects to `/admin-login` after successful setup

**Admin Login** (`/admin-login`):
- Dedicated admin login page with username/password form
- Authenticates admin user against stored credentials
- Creates secure session on successful login
- Redirects to `/admin` dashboard after authentication
- Username/password checks both username validity and role verification

**Protected Admin Resources**:
- `/admin` dashboard - requires admin login via username/password or OAuth
- All admin endpoints protected by `isAdmin` middleware
- Returns 401 for missing authentication, 403 for non-admin users

**Admin Features**:

1. **Quote Management**:
   - View all quotes in searchable/filterable table
   - Click on quotes to view detailed information in side panel
   - Print quotes: Generates formatted print-friendly document with all quote details
   - Delete quotes: With confirmation dialog to prevent accidental deletion
   - Edit quote status: Dropdown to change status between pending/under_review/approved/rejected
   - Add internal notes: Free-form text field for admin notes (persisted via updateQuote endpoint)
   - Real-time status filtering by quote status (All/Pending/Under Review/Approved/Rejected)
   - Search by business name or quote number

2. **Company Settings**:
   - Dedicated Settings tab in admin console
   - Manage company contact information: name, phone, email, address, website
   - Persist settings to PostgreSQL database
   - Real-time form validation and error handling
   - Clean, intuitive UI with icon labels for each field

**Future Enhancements**:
- Permission-based access control for specific features
- Admin user management interface (create additional admins)
- Password reset functionality for admin users

### External Dependencies

**AI Integration**: 
- OpenAI API via Replit AI Integrations service
- GPT-5 model for conversational bond recommendations
- System prompt engineering for surety bond domain expertise
- Fallback error handling for API failures

**Third-Party Services (Integration Points)**:
- Surety carrier API integrations (planned, not implemented)
- Payment processing via Stripe (planned, not implemented)
- Email notifications (planned, not implemented)

**UI Libraries**:
- Radix UI: Accessible component primitives (dialogs, dropdowns, accordions, etc.)
- Embla Carousel: Image carousels
- CMDK: Command palette component
- React Hook Form: Form state and validation
- Zod: Runtime schema validation

**Development Tools**:
- Replit-specific plugins: Cartographer, dev banner, runtime error overlay
- TypeScript for type safety across full stack
- ESBuild for production bundling

**Design Assets**:
- Generated images stored in `attached_assets/generated_images/`
- Construction-themed hero images and professional photography
- Google Fonts (Inter) for typography

### Key Architectural Decisions

**Monorepo Structure**: 
- Single repository with `client/`, `server/`, and `shared/` directories
- Shared TypeScript types and schemas between frontend and backend
- Unified build process with separate dev and production configurations

**Type Safety Strategy**:
- End-to-end TypeScript coverage
- Shared Zod schemas for runtime validation and type inference
- Drizzle ORM for database type safety
- Path aliases (@/, @shared/, @assets/) for clean imports

**Responsive Design**:
- Mobile-first Tailwind utilities
- Breakpoint strategy: mobile (default), tablet (md:), desktop (lg:)
- Touch-friendly UI components with appropriate sizing

**AI-First Positioning**:
- Conversational AI as primary differentiator from traditional surety agencies
- Guided bond selection based on contractor role and project size
- Educational content to demystify surety bonds for contractors

**Scalability Considerations**:
- Interface-based storage allows migration from in-memory to persistent database
- Stateless API design for horizontal scaling
- Client-side routing reduces server load
- Static asset serving in production