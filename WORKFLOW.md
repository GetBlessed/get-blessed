# GetBlessed Development Workflow

## Git Workflow for Feature Development

### 1. Before Starting New Work
```bash
# Always sync with latest changes first
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 2. During Development
- Make your changes in Cursor
- Test thoroughly locally
- Commit frequently with clear messages:
```bash
git add .
git commit -m "feat: description of your changes"
```

### 3. Before Pushing
```bash
# Sync with main again (in case Josh made changes)
git checkout main
git pull origin main
git checkout feature/your-feature-name
git rebase main  # or merge main if preferred
```

### 4. Push and Create PR
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request on GitHub for Josh to review.

### 5. After PR Approval
Josh will handle:
- Merging the PR
- Deployment through Vercel
- Database migrations if needed

## Branch Naming Convention
- `feature/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation updates

## Commit Message Format
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance
- `docs:` - Documentation
- `style:` - Formatting changes
- `refactor:` - Code restructuring

## Environment Variables
Josh manages the Supabase environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Request these from Josh for local development.

## Database Changes
- Never modify database schema directly
- Discuss database changes with Josh first
- Use the existing Supabase functions in `src/lib/supabase/`

## Key Files to Avoid Modifying
- Database configuration files
- Deployment configuration (Vercel)
- Environment variable files (if any)

## Testing
- Test locally with `npm run dev`
- Verify all existing features still work
- Test new features thoroughly before pushing
