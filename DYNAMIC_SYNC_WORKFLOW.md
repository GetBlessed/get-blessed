# Dynamic Project Sync & Setup Workflow

## 🎯 **Use Case:** 
When working with another engineer on a project that has evolved through multiple platforms (e.g., Loveable → GitHub → Database integration), and you need to sync your Cursor environment to match their latest work while establishing a clean development workflow.

## 📖 **Common Scenario:**
*"The [ProjectName] app was first built in Loveable, then connected to a GitHub repository. Later, the project was imported into Cursor but hasn't been updated there since. [Engineer] has been working directly from the GitHub repo, adding a [Database] database and deploying the app through [Platform]. The goal now is to make sure that any work I do inside Cursor uses the latest version of [Engineer]'s codebase and that all future updates follow a clean pull-request flow before deployment."*

## 📋 **Prerequisites:**
- Project exists on GitHub with database integration
- You have Cursor IDE installed with the project imported
- You have access to the GitHub repository
- The other engineer can provide database credentials
- Project may have been deployed through Vercel, Netlify, or similar platform

---

## 🔄 **Step 1: Repository Sync & Assessment**

### **Verify Current State**
```bash
git status
git remote -v  # Confirm GitHub connection
git branch -a  # See all branches
```

### **Assess What's Changed**
```bash
git fetch origin
git log --oneline main..origin/main  # See engineer's new commits
git log --oneline --graph --all --decorate  # Visual commit history
```

**📝 Look for indicators of major changes:**
- Database integration commits (e.g., "add supabase", "feat: database setup")
- New dependencies in commit messages
- Environment/config changes
- Deployment setup

### **Sync with Latest**
```bash
git reset --hard HEAD  # Clear any local changes
git pull origin main --no-edit
```

**⚠️ If git commands get stuck in pager/log view:**
- Press `q` to quit
- Press `Ctrl+C` to cancel
- Close terminal and open new one if needed

---

## 🔧 **Step 2: Examine New Files & Dependencies**

### **Identify New Files/Directories**
Look for new additions that indicate database integration:
```bash
# Check for new directories
ls -la src/lib/  # Database clients often here
ls -la src/utils/  # Utility functions
ls -la src/components/  # New components

# Check for config files
ls -la | grep -E "\.(config|env)"
```

**📁 Common new files to look for:**
- `src/lib/supabase/` or `src/lib/database/`
- `src/utils/storage.ts` or similar
- Database schema/types files
- New component files for database features
- Updated `package.json` with new dependencies

### **Install Missing Dependencies**
```bash
npm install  # Install all dependencies from package.json
```

### **If specific packages are missing (check error messages):**
```bash
# For Supabase
npm install @supabase/ssr @supabase/supabase-js

# For Firebase
npm install firebase

# For Prisma
npm install @prisma/client prisma

# For other databases
npm install [specific-database-package]
```

---

## 🌐 **Step 3: Environment Variables Setup**

### **Request Credentials from Engineer**
Ask for these common variables (adjust based on database type):

**For Supabase:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**For Firebase:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`

**For Prisma/PostgreSQL:**
- `DATABASE_URL`

**For MongoDB:**
- `MONGODB_URI`

**Other common variables:**
- `VITE_API_BASE_URL`
- Upload service keys (Uploadthing, Cloudinary, etc.)

### **Create Environment File**
1. **Create `.env.local` in project root** (same folder as `package.json`)
2. **Add provided credentials:**
   ```env
   # Database credentials from engineer
   VITE_SUPABASE_URL=your_database_url_here
   VITE_SUPABASE_ANON_KEY=your_api_key_here
   
   # Other service credentials
   UPLOAD_SERVICE_KEY=your_upload_key_here
   ```

---

## 🛠️ **Step 4: Handle Connection Errors**

### **Common Issues & Fixes:**

**A. Import/Module Errors:**
```bash
# If you see "Failed to resolve import" errors
npm install [missing-package-name]
```

**B. Database Connection Errors:**
- Check if database client needs fallback values
- Look for files like `lib/database/client.js` or similar
- Add error handling for missing environment variables

**Example fix for database client:**
```javascript
// In your database client file
export function createDatabaseClient() {
  const dbUrl = process.env.DATABASE_URL || 'placeholder-url';
  const apiKey = process.env.API_KEY || 'placeholder-key';
  
  if (!process.env.DATABASE_URL) {
    console.warn('Database credentials missing. Some features will not work.');
  }
  
  return createClient(dbUrl, apiKey);
}
```

**C. Empty Data/Feed Issues:**
- Add mock/fallback data for development
- Modify data fetching functions to return sample data when database fails

---

## 🚀 **Step 5: Start Development Server**

### **Start Server**
```bash
npm run dev
# or
npm start
# or 
yarn dev
```

### **Verify Connection**
1. **Open browser** to displayed URL (usually `http://localhost:3000` or `http://localhost:8080`)
2. **Check for real data** instead of empty/mock data
3. **Open browser console** (F12) to check for connection messages
4. **Test key features** to ensure database integration works

---

## 📝 **Step 6: Establish Clean Development Workflow**

### **Core Principles**
- ✅ **Never commit directly to main/development branches**
- ✅ **Always work on feature branches**
- ✅ **Engineer handles merging and deployment**
- ✅ **Coordinate on naming conventions and configurations**
- ✅ **Maintain connection to GitHub repo at all times**

### **Before Starting Any New Work**
```bash
# Always confirm you're synced
git checkout main
git pull origin main
git status  # Should be clean

# Verify connection to GitHub
git remote -v
```

### **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
# or use agreed naming convention:
# git checkout -b feat/your-feature-name
# git checkout -b task/ticket-number-description
```

### **Development Process**
```bash
# Make your changes in Cursor
# Test thoroughly locally

# Commit changes with clear messages
git add .
git commit -m "feat: description of your changes"

# Push to remote for backup/collaboration
git push origin feature/your-feature-name
```

### **Pull Request Process**
1. **Push your feature branch** to GitHub
2. **Create Pull Request** from your feature branch to main
3. **Add clear description** of changes and testing done
4. **Request review** from the engineer
5. **Engineer reviews, approves, and merges**
6. **Engineer handles deployment** through Vercel/platform
7. **You delete local feature branch** after merge

### **Post-Merge Cleanup**
```bash
git checkout main
git pull origin main  # Get the merged changes
git branch -d feature/your-feature-name  # Delete local branch
git push origin --delete feature/your-feature-name  # Delete remote branch
```

---

## 🔍 **Step 7: Troubleshooting Checklist**

### **If App Won't Load:**
- [ ] Dependencies installed? (`npm install`)
- [ ] Environment variables correct?
- [ ] Database credentials valid?
- [ ] Dev server running without errors?
- [ ] Browser console showing errors?

### **If No Data Appears:**
- [ ] Database connection working?
- [ ] Environment variables using correct prefix? (`VITE_` for Vite, `REACT_APP_` for Create React App)
- [ ] API endpoints accessible?
- [ ] Mock data available as fallback?

### **If Features Don't Work:**
- [ ] All required services configured?
- [ ] Upload services working?
- [ ] Authentication system connected?

---

## 📋 **Step 8: Document Your Setup**

### **Create Project Notes**
Document in your project:
- Database type and connection method
- Required environment variables
- Special setup steps
- Common issues and solutions
- Engineer contact info for questions

---

## 🔄 **Future Syncs (Quick Version)**

For subsequent syncs with the same project:

```bash
# 1. Sync code
git checkout main
git pull origin main

# 2. Update dependencies
npm install

# 3. Restart server
npm run dev

# 4. Create new feature branch
git checkout -b feature/new-feature-name
```

---

## 💡 **Pro Tips for Collaborative Development**

1. **Always communicate with the engineer** before major changes
2. **Never modify database schema** without coordination
3. **Keep environment variables secure** - never commit them to Git
4. **Test thoroughly** before creating pull requests
5. **Document any issues** you encounter for future reference
6. **Ask for database access/admin panel** if available for debugging
7. **Coordinate on naming conventions** for branches, commits, and features
8. **Respect the deployment pipeline** - let engineer handle production deployments
9. **Keep Cursor connected to GitHub** - verify remote connection regularly
10. **Sync frequently** - don't let your local environment get too far behind

## 🤝 **Communication Checklist**

**Before starting work:**
- [ ] Confirm latest sync with engineer
- [ ] Agree on feature branch naming convention
- [ ] Understand any new database changes
- [ ] Get updated environment variables if needed

**During development:**
- [ ] Regular communication about progress
- [ ] Ask questions about database logic/integrations
- [ ] Coordinate if working on related features

**Before submitting PR:**
- [ ] Test all existing functionality still works
- [ ] Document any new environment variables needed
- [ ] Explain changes clearly in PR description

---

## 🚨 **Emergency Reset**

If everything breaks:

```bash
# Nuclear option - start completely fresh
rm -rf node_modules
rm package-lock.json
git reset --hard origin/main
npm install
# Re-create .env.local with credentials
npm run dev
```

---

**This workflow adapts to any database (Supabase, Firebase, Prisma, MongoDB) and any framework (React, Next.js, Vue, etc.). Just adjust the specific package names and environment variable prefixes as needed.**

## 🎯 **Example: GetBlessed App Scenario**

**Situation:** *"The GetBlessed app was first built in Loveable, then connected to a GitHub repository. Later, the project was imported into Cursor but hasn't been updated there since. Josh has been working directly from the GitHub repo, adding a Supabase database and deploying the app through Vercel."*

**Applied Workflow:**
1. **Sync**: `git pull origin main` revealed 50+ commits with Supabase integration
2. **Dependencies**: Added `@supabase/ssr` and `@supabase/supabase-js` packages
3. **Files Found**: New `src/lib/supabase/` directory with client, prayers, types files
4. **Environment**: Josh provided `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. **Testing**: App now shows real prayer feed instead of empty/mock data
6. **Workflow**: Feature branches → PR → Josh reviews → Merge → Vercel deployment

**Key Learnings:**
- Mock data fallbacks prevented app crashes during sync
- Environment variables were crucial for database connection
- Clean separation of concerns: development in Cursor, deployment via Josh
- Regular communication prevented conflicts with database logic

---

**Use this workflow template for any similar collaborative development scenario!**
