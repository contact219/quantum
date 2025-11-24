# Quantum Surety - AI-Powered Construction Surety Bond Platform

## Overview
Quantum Surety is an AI-first surety bond agency specializing in construction bonds, aiming to be "THE #1 AI-POWERED CONSTRUCTION SURETY BOND AGENCY." The platform provides fast, smart bonding solutions for contractors, general contractors, and subcontractors through a full-stack web application with a React frontend and Express backend. Key features include an AI-powered bond finder chatbot, multi-step quote forms, and comprehensive resources for construction professionals. The project's ambition is to modernize the surety bond industry by leveraging AI for efficient and accessible bonding processes, targeting a significant market share in construction.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Core Technologies
The application is built as a monorepo with a React/TypeScript frontend (Vite, Wouter, Shadcn/ui, Tailwind CSS, TanStack Query, React Hook Form, Zod) and an Express.js/TypeScript backend (Node.js).

### UI/UX Decisions
- **Design**: Clean B2B SaaS patterns with modern visual treatments (gradients, bold hero sections).
- **Typography**: Inter font family.
- **Color Scheme**: Indigo (primary), Teal/Emerald (accent), with semantic colors for states.
- **Responsiveness**: Mobile-first design with Tailwind utilities for breakpoints (mobile, tablet, desktop).

### Technical Implementations
- **Frontend**: File-based routing, Shadcn/ui for components, Tailwind CSS for styling, TanStack Query for server state, React Hook Form with Zod for forms.
- **Backend**: RESTful API endpoints for quotes, AI chat, and admin functionalities.
- **Data Storage**: PostgreSQL via Neon serverless database, with Drizzle ORM for type-safe queries. In-memory storage for development.
- **Authentication**: Production-ready multi-layer security using Replit Auth (OpenID Connect via Passport.js) for clients and a separate username/password system for administrators. Includes session management, route protection, API endpoint protection, and role-based access control (RBAC) for admin users. Admin setup and login flows are distinct, with admin role preservation across Replit Auth logins.
- **Admin Features**: Quote management (view, print, delete, edit status, add notes), Company Settings management, Carrier Management System (underwriting rules engine, capacity management, commission dashboard, performance metrics, quote auto-routing/recommendation).
- **AI Integration**: OpenAI API (GPT-5) for conversational bond recommendations, with system prompt engineering for domain expertise.

### System Design Choices
- **Monorepo**: Facilitates shared types and schemas between frontend and backend.
- **Type Safety**: End-to-end TypeScript, shared Zod schemas, and Drizzle ORM.
- **AI-First Positioning**: Core differentiator, leveraging conversational AI for bond selection and user education.
- **Scalability**: Interface-based storage, stateless API design, client-side routing, and static asset serving.

## External Dependencies

- **AI**: OpenAI API (via Replit AI Integrations service) utilizing GPT-5.
- **Database**: PostgreSQL (Neon serverless database).
- **ORM**: Drizzle ORM.
- **UI Libraries**: Radix UI, Embla Carousel, CMDK, React Hook Form, Zod.
- **Development Tools**: Replit-specific plugins (Cartographer, dev banner, runtime error overlay), TypeScript, ESBuild.
- **Design Assets**: Google Fonts (Inter), generated construction-themed imagery.