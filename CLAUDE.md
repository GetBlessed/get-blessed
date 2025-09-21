# GetBlessed Project Guidelines

## Project Overview
GetBlessed is a community prayer and blessing platform built with React, TypeScript, and Supabase. It connects hearts through prayer, allowing users to share prayer requests, blessings, and support each other in their spiritual journeys.

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and Context API
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Backend/Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth (not yet implemented)
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives via shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner toast

## Project Structure
```
src/
├── components/       # Reusable React components
│   ├── ui/          # shadcn/ui components (DO NOT modify directly)
│   └── ...          # Feature-specific components
├── pages/           # Route-based page components
├── lib/             # Core utilities and configurations
│   └── supabase/    # Supabase client and database functions
│       ├── client.ts           # Supabase client initialization
│       ├── prayers.ts          # Prayer/blessing CRUD operations
│       └── database.types.ts  # Generated TypeScript types
├── hooks/           # Custom React hooks
└── utils/           # Helper functions and utilities
    └── prayerStorage.ts  # Prayer storage with Supabase/localStorage fallback
```

## Database Schema (Supabase)

### Tables

1. **users** - User profiles (for future authentication)
   - id (UUID, primary key)
   - email, name, avatar_url, organization, phone
   - created_at, updated_at

2. **prayers** - Stores both prayers and blessings
   - id (UUID, primary key)
   - user_id (UUID, nullable - always NULL for now)
   - content, type ('prayer' or 'blessing')
   - author_name (display name)
   - category, support_count
   - anonymous, urgent, on_behalf_of
   - organization_type ('individual' or 'organization')
   - scripture, image_url
   - created_at, updated_at

3. **prayer_supports** - Tracks prayer support/likes
   - id (UUID, primary key)
   - prayer_id, user_id, ip_address
   - created_at

4. **waitlist** - Beta user signups
   - id (UUID, primary key)
   - email (unique), name, phone, organization
   - created_at

## Coding Standards

### TypeScript Configuration
- TypeScript is configured with relaxed settings for rapid development
- `noImplicitAny`, `noUnusedParameters`, `noUnusedLocals`, and `strictNullChecks` are disabled
- Use type annotations where they improve code clarity, but don't stress about perfect typing

### Component Patterns
1. **Functional Components Only**: Always use arrow functions or function declarations
2. **Component Structure**:
   ```tsx
   const ComponentName = () => {
     // Hooks first
     const [state, setState] = useState();

     // Effects next
     useEffect(() => {}, []);

     // Handlers
     const handleClick = () => {};

     // Render
     return <div>...</div>;
   };
   ```

3. **File Naming**:
   - Components: PascalCase (e.g., `PrayerCard.tsx`)
   - Utilities: camelCase (e.g., `prayerStorage.ts`)
   - Pages: PascalCase (e.g., `Index.tsx`)

### Styling Conventions
- Use Tailwind CSS utility classes for all styling
- Follow the existing pattern of responsive design with `sm:`, `md:`, `lg:` prefixes
- Use shadcn/ui components from `@/components/ui/` for consistent UI
- Custom styling order: size → spacing → colors → borders → shadows → animations

### Import Organization
Always organize imports in this order:
1. React and core libraries
2. UI components from `@/components/ui/`
3. Custom components from `@/components/`
4. Pages and routing
5. Utilities and helpers
6. Types and interfaces
7. Static assets

Example:
```tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PrayerCard } from "@/components/PrayerCard";
import { getStoredPrayers } from "@/utils/prayerStorage";
```

### Supabase Integration
- **Client Setup**: Use `createSupabaseClient()` from `@/lib/supabase/client.ts`
- **Environment Variables**:
  - `VITE_SUPABASE_URL`: Supabase project URL
  - `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- **Project ID**: spsjjmuvmaydovoeabwh (for MCP tools)
- **MCP Tool Access**: The Supabase MCP tools are available for database operations
- **Real-time**: Leverage Supabase real-time subscriptions for live updates
- **Key Functions** in `prayers.ts`:
  - `fetchPrayers()` - Get all prayers/blessings
  - `fetchPrayer(id)` - Get single prayer/blessing
  - `insertPrayer()` - Create new prayer/blessing
  - `addPrayerSupport()` - Add support to prayer
  - `subscribeToPrayers()` - Real-time updates
  - `addToWaitlist()` - Add user to waitlist

### State Management
- Use local component state for UI-specific state
- Use TanStack Query for server state and data fetching
- `prayerStorage.ts` provides Supabase operations with localStorage fallback
- All prayers/blessings stored in Supabase (localStorage is backup only)

### Form Handling
- Use React Hook Form for all forms
- Validate with Zod schemas
- Follow the existing pattern in `PrayerSubmission.tsx`

### Error Handling
- Always handle loading and error states in data fetching
- Use toast notifications (Sonner) for user feedback
- Log errors to console in development

### Mobile-First Design
- Always design for mobile screens first
- Test responsive breakpoints: mobile (default), sm (640px+), md (768px+), lg (1024px+)
- Use the `use-mobile` hook when needed for mobile-specific logic

## Common Patterns

### Creating a New Component
1. Create file in appropriate directory (`components/` or `pages/`)
2. Use existing components as reference for structure
3. Import and use shadcn/ui components from `@/components/ui/`
4. Apply Tailwind classes for styling

### Adding a New Route
1. Create page component in `src/pages/`
2. Add route to `App.tsx` router configuration
3. Follow existing page structure patterns

### Working with Prayers/Blessings
- Use `StoredPrayer` type from `utils/prayerStorage.ts`
- Both prayers and blessings stored in same `prayers` table
- Differentiated by `type` field ('prayer' or 'blessing')
- All submissions have `user_id = NULL` (no auth yet)
- Support counting handled by database triggers
- Real-time updates via Supabase subscriptions

## Testing & Quality
- Run `npm run lint` before committing
- Test on both desktop and mobile viewports
- Ensure all interactive elements are keyboard accessible
- Check for console errors before submitting changes

## Performance Considerations
- Lazy load heavy components when appropriate
- Use React.memo for expensive re-renders
- Optimize images and media assets
- Keep bundle size minimal

## Security Guidelines
- Never expose sensitive keys in frontend code
- Validate and sanitize user inputs
- Use Supabase Row Level Security (RLS) for data access
- Follow CORS best practices

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Important Notes
- **Authentication**: Not yet implemented - all users are anonymous
- **Waitlist System**: Active - collects emails for future features
- **Database**: Fully integrated with Supabase
  - All prayers/blessings stored in PostgreSQL
  - Real-time updates working
  - localStorage used as fallback only
- **Current Limitations**:
  - No user accounts yet (all `user_id = NULL`)
  - No RLS policies (disabled for development)
  - Dashboard and Gifts sections show waitlist modal
- **Inclusive Platform**: All faiths and traditions welcome

## MCP Tools Context
When working with Supabase operations, use the available MCP tools:
- **Project ID**: spsjjmuvmaydovoeabwh
- **Available Operations**:
  - `mcp__supabase__execute_sql` - Direct SQL queries
  - `mcp__supabase__apply_migration` - DDL operations
  - `mcp__supabase__list_tables` - View schema
  - `mcp__supabase__generate_typescript_types` - Update types

Always check if an operation can be performed via MCP tools before implementing custom API calls.