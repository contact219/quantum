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
- **Email System**: SendGrid integration for transactional emails, notification tracking, and email notification logs.
- **Analytics**: Admin analytics dashboard with charts showing quotes, applications, approvals, and performance metrics.
- **User Management**: Role-based permissions system for admins, underwriters, sales, finance, and client roles with view/edit/approve permissions.

### System Design Choices
- **Monorepo**: Facilitates shared types and schemas between frontend and backend.
- **Type Safety**: End-to-end TypeScript, shared Zod schemas, and Drizzle ORM.
- **AI-First Positioning**: Core differentiator, leveraging conversational AI for bond selection and user education.
- **Scalability**: Interface-based storage, stateless API design, client-side routing, and static asset serving.

## External Dependencies

- **AI**: OpenAI API (via Replit AI Integrations service) utilizing GPT-5.
- **Database**: PostgreSQL (Neon serverless database).
- **ORM**: Drizzle ORM.
- **Email**: SendGrid API for transactional emails and notifications.
- **UI Libraries**: Radix UI, Embla Carousel, CMDK, React Hook Form, Zod, Recharts (for analytics dashboards).
- **Development Tools**: Replit-specific plugins (Cartographer, dev banner, runtime error overlay), TypeScript, ESBuild.
- **Design Assets**: Google Fonts (Inter), generated construction-themed imagery.

## Surety Application Portal (Phase 2 - Production-Ready Implementation)

**Status**: ✅ **Complete**

### Core Features

**1. Contractor Application Portal** (`/portal/application`)
- Web-based application form for contractors/agents to submit bonding applications
- Company information capture (name, contact, business type, years in business, revenue)
- Application tracking dashboard showing status of all submitted applications
- Real-time application status updates (draft → submitted → approved/rejected → bonded)

**2. Document Upload & Management**
- 8 document types supported:
  - **Required**: Bond Request Form, Project Contract/Bid Specs, Financial Statements, Credit Authorization
  - **Optional**: Resume/Experience, Job Cost Breakdown, Prior Bond History, Work-on-Hand Schedule
- Document validation with status tracking (pending → valid/invalid)
- Missing document detection and clear notifications
- Document history and retrieval

**3. Automated Credit Pulls**
- Credit pull integration endpoints (ready for Plaid, Equifax, Dun & Bradstreet)
- Credit score and risk assessment capture
- Debt-to-income ratio calculation
- Business rating integration
- Full pull history per application

**4. Automated Underwriting Rules Engine**
- Intelligent evaluation against carrier underwriting rules:
  - Credit score requirements (default 600+)
  - Years in business validation (default 1+)
  - Minimum revenue verification (default $100k+)
  - Document completeness checking
- Generates underwriting status and rule validation results
- Flags issues for admin review

**5. Preliminary Quote Generation**
- Automatic bond quote creation from application data
- Premium calculation engine (2% default rate)
- Bond type assignment (Performance Bond template)
- Quote ID linking for tracking

**6. E-Signature Workflow**
- E-signature package preparation (DocuSign/PandaDoc ready)
- Envelope ID generation and tracking
- E-signature status management
- Document preparation for electronic signing

### Database Schema
- `surety_applications` - Application records with full underwriting status
- `application_documents` - Document uploads with validation status
- `credit_pulls` - Credit verification records and results
- `emailNotifications` - Email notification logs with status tracking
- `analytics` - Platform analytics snapshots

### API Endpoints
- `POST /api/applications` - Create new application
- `GET /api/applications` - List user's applications
- `GET /api/applications/:id` - Get application with documents and credit pull
- `POST /api/applications/:id/documents` - Upload document
- `GET /api/applications/:id/documents` - List application documents
- `POST /api/applications/:id/evaluate` - Run automated underwriting
- `POST /api/applications/:id/quote` - Generate preliminary quote
- `POST /api/applications/:id/e-sign` - Prepare for e-signature

### Admin Features & Endpoints
- `GET /api/admin/analytics` - Retrieve analytics snapshot (total quotes, applications, approvals, conversion rates)
- `GET /api/admin/users` - List admin users with roles
- `PATCH /api/admin/users/:userId/role` - Update user role and permissions

### Integration Points
- **Stripe**: Ready for premium payment processing
- **Plaid/Credit Bureaus**: Ready for automated credit pulls
- **DocuSign/PandaDoc**: Ready for e-signature workflow
- **Email**: SendGrid configured for document submission and signing notifications
- **Analytics**: Recharts visualization for admin dashboards
- Environment variable support for all external services

### Security & Access Control
- All endpoints protected by Replit Auth
- User-specific application access (can only view own applications)
- Admin oversight capability for quote management
- Session-based authentication throughout
- Role-based permissions (admin, underwriter, sales, finance, client)

## Admin Dashboard Features

**Status**: ✅ **Complete**

### Quote Management
- View all submitted quotes with advanced filtering
- Edit quote details and status
- Add notes and internal comments
- Print quote documents
- Delete quotes with confirmation

### Analytics Dashboard (`/admin/analytics`)
- Real-time metrics: total quotes, applications, bonds, approvals/rejections
- Monthly activity trends (line charts)
- Application status distribution (pie chart)
- Performance metrics (avg approval time, total commissions)
- Data export ready

### User Management (`/admin/users`)
- Admin user management interface
- Role assignment (admin, underwriter, sales, finance, client)
- Permission control (view, edit, approve)
- Bulk user updates support

### Company Settings
- Email configuration and testing
- Bond types and limits
- Commission structure
- System preferences

### Carrier Management
- Carrier profiles with contact details
- Commission tracking per carrier
- Underwriting rules configuration
- Capacity management by year
- Performance metrics tracking

### Email Notifications System
- Automated notifications for quote updates
- Application status change emails
- Document request notifications
- SendGrid integration for reliable delivery
- Notification tracking and logging
