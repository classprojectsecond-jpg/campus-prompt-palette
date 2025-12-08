# Campus Prompt Palette

## Overview

Campus Prompt Palette is a Korean-language, front-end-only AI prompt generation studio designed specifically for university students. The application helps students create high-quality, contextual prompts for various academic tasks including reports, exams, coding assignments, research, career documents, and image generation. The app generates prompt strings that users can copy and use with external LLM services (ChatGPT, Gemini, etc.) - it does not call any AI APIs directly.

The application features a tabbed interface where each tab represents a different academic domain, with shared common settings that apply across all prompt types. Users can preview generated prompts, save them to a local library, and retrieve them later.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack

**Framework & Build Tools:**
- React 18.3+ with TypeScript (TSX)
- Vite as the build tool and dev server
- Created from Lovable.dev platform template

**UI Component Library:**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design system
- Class Variance Authority (CVA) for component variants
- Korean (Noto Sans KR) and Inter fonts

**State Management:**
- Custom React hooks for application state (`useAppState`, `useTheme`)
- Local component state with React hooks
- No external state management library (Redux, Zustand, etc.)

**Routing:**
- React Router v6 for client-side routing
- Single-page application with minimal routing (main Index page + NotFound fallback)

### Application Architecture

**Component Structure:**
The application follows a component-based architecture with clear separation of concerns:

1. **Layout Components:**
   - `Header`: Top navigation with theme toggle and branding
   - `TabNavigation`: Horizontal tab selector for different prompt types
   - `RightPanel`: Collapsible sidebar containing common settings and saved prompts library

2. **Tab-Specific Components:**
   - Each tab (Report, Exam, Coding, Research, Career, Image) has its own component
   - Tab components manage domain-specific form inputs
   - Located in `src/components/tabs/`

3. **Shared Form Components:**
   - `CommonSettings`: Right panel component for cross-cutting settings
   - `StageSelector`: Multi-stage workflow selection (research, outline, full write)
   - `FileAttachmentSection`: Describes files attached in external systems
   - `PromptPreview`: Bottom section displaying and managing generated prompts
   - `PromptLibrary`: Saved prompts management with copy/delete/load functions

**Prompt Generation Engine:**
The app includes a prompt building system in `src/promptEngine/`:

- `types.ts`: TypeScript type definitions for all prompt-related data structures
- `buildPrompt.ts`: Core prompt assembly logic that combines common settings with tab-specific inputs
- `tabBuilders.ts`: Individual builders for each tab type's unique prompt requirements

The engine constructs prompts by:
1. Establishing role and context based on user profile
2. Applying mode settings (learning vs deliverable)
3. Incorporating common options (tone, sources, self-check, etc.)
4. Adding tab-specific content requirements
5. Including reflection patterns and guardrails

**Data Flow:**
1. User inputs flow from tab components → `useAppState` hook → central state
2. Common settings from `RightPanel` → central state
3. "Generate" button triggers → `generatePrompt()` utility → combines all state
4. Generated prompt → `PromptPreview` component for display/copy/save
5. Save action → localStorage → `PromptLibrary` for retrieval

### Data Persistence

**localStorage Strategy:**
- All data persistence uses browser localStorage (no backend/database)
- Saved prompts stored as JSON with metadata (title, notes, timestamp, tab type)
- Theme preference persisted across sessions
- No user authentication or cloud sync

**Storage Schema:**
```typescript
{
  savedPrompts: SavedPrompt[]  // Array of saved prompt objects
  theme: 'light' | 'dark'      // User's theme preference
}
```

### Type System

The application uses TypeScript with relaxed strictness settings (`strict: false`) to accommodate rapid development:

- `src/types/prompt.ts`: Main type definitions for application state
- `src/promptEngine/types.ts`: Prompt engine-specific types
- Path aliases configured (`@/*` maps to `src/*`)

**Key Types:**
- `TabType`: Union of available tab IDs
- `CommonSettings`: Shared settings across all tabs
- `StageSelection`: Multi-stage workflow flags
- `[Tab]Data`: Individual data types for each tab (ReportTabData, ExamTabData, etc.)
- `SavedPrompt`: Structure for persisted prompts

### Styling & Theming

**Design System:**
- Custom CSS variables in `src/index.css` define a "Soft Academic Blues" color palette
- Light/dark theme support with class-based theme switching
- Custom campus-specific color variables (navy, blue, sky, teal, mint, light)
- Gradient definitions for visual polish

**Animation & Transitions:**
- Custom animation utilities (fade-in, slide-up, etc.)
- Glass-morphism effects for cards and panels
- Smooth transitions for theme switching and panel toggles

**Responsive Design:**
- Mobile-first approach with Tailwind breakpoints
- Collapsible right panel on mobile devices
- Adaptive tab navigation with icon-only mode on small screens

### Build & Development

**Configuration:**
- Vite config with SWC for fast compilation
- Development server on port 5000 with strict port enforcement
- Component tagging plugin for development mode (lovable-tagger)
- Path resolution aliases for clean imports

**Code Quality:**
- ESLint configuration with React hooks rules
- TypeScript compiler options optimized for bundler mode
- Unused variables/parameters checks disabled for flexibility

### Localization

**Language Support:**
- Primary language: Korean (ko)
- All UI text, labels, placeholders in Korean
- English technical terms preserved where appropriate (ChatGPT, Gemini, etc.)
- Meta tags and SEO optimized for Korean content

## External Dependencies

**Core UI Libraries:**
- @radix-ui/react-* (v1.x): Headless UI primitives for accessibility
  - Accordion, Dialog, Select, Tabs, Toast, and 20+ other components
  - Provides keyboard navigation and ARIA compliance

**Form Handling:**
- react-hook-form (implied via @hookform/resolvers): Form state management
- zod (implied via resolvers): Runtime type validation

**Utility Libraries:**
- clsx + tailwind-merge (via cn utility): Conditional className composition
- class-variance-authority: Type-safe component variants
- date-fns: Date formatting and manipulation
- lucide-react: Icon library

**Carousel/UI Enhancements:**
- embla-carousel-react: Carousel functionality
- cmdk: Command palette component
- input-otp: One-time password input
- vaul: Drawer/modal component
- next-themes: Theme management

**Build Tools:**
- tailwindcss + autoprefixer: CSS processing
- @vitejs/plugin-react-swc: Fast React compilation
- lovable-tagger: Development component debugging

**Query Management:**
- @tanstack/react-query: Server state management (minimal usage, primarily for future extensibility)

**No Backend Dependencies:**
- No database (Drizzle, Prisma, etc.)
- No API framework (Express, Fastify, etc.)
- No authentication service
- No external LLM API clients

The application is intentionally kept as a pure frontend tool, generating prompt strings for users to manually copy into external AI services rather than integrating with APIs directly.