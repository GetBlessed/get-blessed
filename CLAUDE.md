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
- **Authentication**: Supabase Auth
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
│   └── supabase/    # Supabase client setup
├── hooks/           # Custom React hooks
└── utils/           # Helper functions and utilities
```

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
- **MCP Tool Access**: The Supabase MCP tools are available for database operations
- **Real-time**: Leverage Supabase real-time subscriptions for live updates

### State Management
- Use local component state for UI-specific state
- Use TanStack Query for server state and data fetching
- Store persistent data in localStorage via utility functions (e.g., `prayerStorage.ts`)
- Consider Supabase for persistent user data

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
- Follow existing CRUD patterns for prayer operations
- Maintain consistency with existing data structure

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
- The project uses a waitlist system - authentication is temporarily disabled
- Dashboard and Gifts sections show waitlist modal when accessed
- Local storage is used for prayer persistence (will migrate to Supabase)
- All faiths and traditions are welcome - maintain inclusive language

## MCP Tools Context
When working with Supabase operations, use the available MCP tools:
- Database queries and mutations
- Authentication operations
- Real-time subscriptions
- Storage operations

Always check if an operation can be performed via MCP tools before implementing custom API calls.