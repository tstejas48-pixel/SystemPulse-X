# Contributing to SystemPulse

Thank you for your interest in contributing to SystemPulse! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/systempulse/issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - System information (OS, Node version, browser)

### Suggesting Features
1. Check [existing feature requests](https://github.com/yourusername/systempulse/issues?q=is%3Aissue+label%3Aenhancement)
2. Create a new issue with `enhancement` label
3. Describe the feature and its use case
4. Explain why it would benefit users

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git
- Code editor (VS Code recommended)

### Local Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/systempulse.git
cd systempulse

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Push database schema
npx drizzle-kit push

# Start development server
npm run dev
```

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ...

# Run type checking
npm run typecheck

# Build to check for errors
npm run build

# Commit changes
git add .
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/my-feature
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── alerts/       # Alert management
│   │   ├── export/       # CSV export
│   │   └── system/       # System monitoring
│   ├── about/            # About page
│   ├── settings/         # Settings page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── AlertBadge.tsx
│   ├── MetricCard.tsx
│   ├── ProcessTable.tsx
│   ├── SystemChart.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── db/                    # Database
│   ├── index.ts          # DB connection
│   └── schema.ts         # Tables
└── lib/                   # Utilities
    └── utils.ts
```

## 💻 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define interfaces for complex objects
- Use type inference where possible
- Avoid `any` type

```typescript
// ✅ Good
interface SystemData {
  cpu: {
    percent: number;
    cores: number;
  };
}

// ❌ Bad
const data: any = fetchData();
```

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names
- Export as named exports

```typescript
// ✅ Good
export function MetricCard({ title, value }: MetricCardProps) {
  return <div>...</div>;
}

// ❌ Bad
export default function Card(props: any) {
  return <div>...</div>;
}
```

### API Routes
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return consistent JSON responses
- Include error handling
- Use `export const dynamic = 'force-dynamic'` for non-cached routes

```typescript
// ✅ Good
export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

### Database Queries
- Use Drizzle ORM for all database operations
- Avoid raw SQL unless absolutely necessary
- Use transactions for related operations
- Add proper error handling

```typescript
// ✅ Good
const readings = await db
  .select()
  .from(systemReadings)
  .where(gte(systemReadings.timestamp, timeAgo))
  .orderBy(desc(systemReadings.timestamp));
```

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use consistent spacing (multiples of 4)
- Keep color palette consistent

```tsx
// ✅ Good
<div className="rounded-lg bg-white p-6 dark:bg-gray-800">

// ❌ Bad
<div style={{ backgroundColor: '#fff', padding: '24px' }}>
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Writing Tests
```typescript
import { render, screen } from '@testing-library/react';
import { MetricCard } from '@/components/MetricCard';

describe('MetricCard', () => {
  it('renders title and value', () => {
    render(<MetricCard title="CPU" value="50%" />);
    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
```

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add network speed chart
fix: correct CPU percentage calculation
docs: update installation instructions
style: format code with prettier
refactor: simplify alert checking logic
test: add tests for ProcessTable
chore: update dependencies
```

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
feat(api): add system info endpoint

Add new API endpoint that returns detailed system information
including hardware specs and OS details.

Closes #123
```

## 🎨 UI/UX Guidelines

### Design Principles
- **Clarity**: Information should be easy to understand
- **Consistency**: Similar elements behave similarly
- **Feedback**: User actions should have visible feedback
- **Accessibility**: Support keyboard navigation and screen readers

### Color Usage
- **Green**: Normal/good state (< 70%)
- **Yellow**: Warning state (70-85%)
- **Red**: Critical state (> 85%)
- **Blue**: Neutral/informational

### Responsive Design
- Test on mobile (< 640px)
- Test on tablet (640px - 1024px)
- Test on desktop (> 1024px)

## 🔍 Code Review Checklist

Before submitting a PR, ensure:
- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code is formatted consistently
- [ ] Comments explain complex logic
- [ ] No console.log statements (use console.error for errors)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode works correctly
- [ ] Database queries are optimized
- [ ] Error handling is present
- [ ] Environment variables are documented

## 🚀 Feature Development Guide

### Adding a New Metric

1. **Update Database Schema** (`src/db/schema.ts`)
```typescript
export const systemReadings = pgTable("system_readings", {
  // ... existing fields
  newMetric: real("new_metric"),
});
```

2. **Create API Endpoint** (`src/app/api/system/new-metric/route.ts`)
```typescript
export async function GET() {
  // Fetch metric using systeminformation
  const data = await si.newMetric();
  return NextResponse.json(data);
}
```

3. **Add Component** (`src/components/NewMetricCard.tsx`)
```typescript
export function NewMetricCard({ value }: Props) {
  return <MetricCard title="New Metric" value={value} />;
}
```

4. **Update Dashboard** (`src/app/page.tsx`)
```typescript
const [newMetric, setNewMetric] = useState(0);

// In fetch function
const metric = await fetch('/api/system/new-metric');
setNewMetric(metric);

// In JSX
<NewMetricCard value={newMetric} />
```

5. **Push Schema Changes**
```bash
npx drizzle-kit push
```

### Adding a New Page

1. **Create Page File** (`src/app/new-page/page.tsx`)
```typescript
export default function NewPage() {
  return <div>New Page Content</div>;
}
```

2. **Add Navigation Link** (in main pages)
```typescript
<Link href="/new-page">New Page</Link>
```

3. **Update Metadata** (if needed)
```typescript
export const metadata = {
  title: 'New Page - SystemPulse',
};
```

## 🐛 Debugging Tips

### TypeScript Errors
```bash
# Check all type errors
npm run typecheck

# VS Code: Restart TS Server
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1"

# Reset schema (development only!)
npx drizzle-kit push --force
```

### API Debugging
```typescript
// Add detailed logging
console.error('API Error:', {
  error,
  stack: error.stack,
  timestamp: new Date().toISOString(),
});
```

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)

### Tools
- [systeminformation](https://github.com/sebhildebrandt/systeminformation)
- [Recharts](https://recharts.org/en-US/api)
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/)

## 🎯 Good First Issues

Look for issues labeled `good-first-issue`:
- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Test coverage improvements

## 💬 Communication

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and features
- **Pull Requests**: Use PR comments for code review

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SystemPulse! 🎉
