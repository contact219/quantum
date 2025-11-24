# Quantum Surety Design Guidelines

## Design Approach
**Selected Approach:** Design System with Modern B2B SaaS Enhancement
- Base: Clean, professional design system patterns for credibility and efficiency
- Enhancement: Bold hero sections, strategic use of gradients, and modern visual treatments to position as cutting-edge AI platform
- Industry positioning: Must visually distance from outdated surety bond websites while maintaining professional trust

## Core Design Elements

### A. Typography
**Font Stack:** Inter (Google Fonts) for entire application
- **Hero Headlines:** text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight
- **Section Headlines:** text-3xl md:text-4xl, font-bold
- **Subheadlines:** text-xl md:text-2xl, font-medium, text-gray-600
- **Body Copy:** text-base md:text-lg, leading-relaxed
- **Small/Meta Text:** text-sm, font-medium
- **Button Text:** text-base, font-semibold

### B. Layout System
**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistency
- **Section Padding:** py-16 md:py-24 lg:py-32
- **Container Max Width:** max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- **Card Spacing:** p-6 md:p-8
- **Component Gaps:** gap-6 md:gap-8 for grids, gap-4 for lists

### C. Color Application
**Primary (Indigo):** Buttons, headings accents, active states, primary CTAs
**Accent (Teal/Emerald):** Success indicators, AI-related features, secondary CTAs, highlights
**Neutrals:** Gray scale for text hierarchy, backgrounds, borders
**Semantic:** Green for success, red for errors, amber for warnings

### D. Component Library

**Navigation:**
- Sticky header with subtle shadow on scroll
- Logo left, primary links center, CTA button right
- Mobile: Hamburger menu with slide-in drawer

**Hero Sections:**
- Full-width gradient background (indigo-900 to indigo-700)
- Large hero image showing construction site or contractors at work (positioned right side on desktop, full-width on mobile)
- Headline + subheadline + dual CTA buttons (primary indigo, secondary teal with blur backdrop)
- Minimum height: min-h-[600px] md:min-h-[700px]

**Bond Category Grid:**
- 3-column on desktop, 2-column tablet, 1-column mobile
- Cards with subtle border, hover lift effect (transform scale), icon at top
- Use Heroicons for all icons (consistent style)

**AI Chat Interface:**
- Card-based messages with distinct styling for user vs AI
- AI messages: gradient background (indigo-50 to teal-50), rounded-2xl
- User messages: solid indigo-600, text-white, rounded-2xl
- Input bar: fixed bottom with blur backdrop

**Quote Wizard:**
- Step indicators at top (numbered circles with connecting lines)
- Each step in contained card with generous padding
- Form inputs: consistent height (h-12), rounded-lg borders
- Progress save indicator in top right

**Data Tables (Portal/Admin):**
- Alternating row backgrounds for readability
- Sticky headers on scroll
- Status badges with semantic colors (rounded-full pills)
- Hover row highlight

**Cards:**
- Base: rounded-xl, border border-gray-200, p-6
- Interactive cards: hover:shadow-lg transition
- Feature cards: include icon, title, description, optional CTA link

**Buttons:**
- Primary: bg-indigo-600 hover:bg-indigo-700, rounded-lg, px-6 py-3
- Secondary: bg-teal-600 hover:bg-teal-700, rounded-lg, px-6 py-3
- Outline: border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50
- Large CTAs: px-8 py-4 text-lg

**Footer:**
- Multi-column layout (4 columns desktop, 2 tablet, 1 mobile)
- Dark background (bg-gray-900), light text
- Separated sections: Links, Resources, Legal, Contact
- Small disclaimer text at bottom

### E. Page-Specific Layouts

**Home Page:**
- Hero with construction site image (right side, 50% width on desktop)
- "Why Contractors Choose Us" - 4-column icon grid
- Bond Categories - 3-column card grid with icons
- Social proof section - stats or testimonials
- Final CTA section with gradient background

**Construction Page:**
- Hero similar to home but construction-specific imagery
- Two-column sections alternating: GC content (left) with image (right), then Sub content (right) with image (left)
- AI mini-widget as prominent centered card with form inputs
- Bond types explained in expandable accordions or card grid

**AI Bond Finder:**
- Chat interface centered, max-w-3xl
- Messages container with scroll, minimum height
- Quick select buttons for common questions
- Typing indicator animation for AI responses

**Quote Wizard:**
- Centered form, max-w-2xl
- Each step as full-screen card
- Navigation buttons at bottom (Back, Continue)
- Summary page with all info displayed in organized sections

**Client Portal:**
- Left sidebar navigation (fixed)
- Main content area with dashboard cards
- Charts using simple bar/line visualizations
- Table views with sorting and filtering UI

**Admin Console:**
- Similar to portal but with additional controls
- Side drawer that slides in from right for details
- Filter bar at top with multiple select inputs
- Bulk action controls for table rows

### F. Images Strategy

**Required Images:**
1. **Hero (Home):** Wide shot of modern construction site with workers in safety gear, bright daylight - positioned right 50% on desktop
2. **Hero (Construction):** Close-up of contractor reviewing blueprints or using tablet on site - full-width background with overlay
3. **GC Section:** Professional contractor in office or on-site management scene
4. **Sub Section:** Subcontractor team working on specific trade (electrical, plumbing, framing)
5. **Portal Dashboard:** Placeholder avatars for user profiles

**Image Treatment:**
- Hero images: Subtle gradient overlay for text readability
- Section images: Rounded corners (rounded-xl), subtle shadow
- All images should convey: Modern, professional, diverse workforce, safety-conscious

### G. Accessibility
- Form labels always visible (not placeholder-only)
- Focus states: ring-2 ring-indigo-500 ring-offset-2
- Color contrast ratios WCAG AA compliant
- Keyboard navigation support for all interactive elements
- Screen reader text for icon-only buttons

### H. Responsive Breakpoints
- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px - 1024px (2 columns, simplified navigation)
- Desktop: > 1024px (full multi-column layouts, side-by-side content)

This design positions Quantum Surety as a modern, trustworthy, AI-powered platform that feels significantly more advanced than traditional surety bond websites while maintaining the professionalism contractors expect.