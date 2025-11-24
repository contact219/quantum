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

### Authentication and Authorization

**Current State**: Basic structure in place but not fully implemented

**Planned Approach**:
- User authentication with username/password
- Role-based access (client vs admin)
- Session management using express-session with PostgreSQL store (connect-pg-simple)

**Integration Points**:
- Auth middleware hooks in routing layer
- User context propagation to API handlers
- Protected routes for Portal and Admin sections

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