# Production-Quality Frontend Hackathon Starter

Built for rapid prototyping and production deployment during college hackathons.

## Tech Stack
- **Framework:** React 19 + Vite 8 + TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 + OKLCH / CSS custom variants + Theme Toggle (Dark / Light)
- **UI Components:** Complete shadcn-compatible primitives (`@/components/ui/*`)
- **Icons:** Lucide React
- **Routing:** React Router v7 with route-level code splitting (`React.lazy`)
- **State Management:** Redux Toolkit (client-side) + TanStack Query (server-side caching)
- **HTTP Client:** Centralized Axios instance with Bearer interceptors
- **Form & Validation:** React Hook Form + Zod v4 schemas
- **Notifications:** Sonner toasts
- **Error Boundaries:** React Error Boundary

---

## Quick Start

```powershell
# 1. Install dependencies (already installed)
npm install --legacy-peer-deps

# 2. Start development server
npm run dev

# 3. Production build & type check
npm run build
```

---

## How to Build Features (When Problem Statement Drops)

Create your feature under `src/features/[feature-name]/`:

```text
src/features/products/
├── components/         # Feature-specific components (e.g. ProductCard.tsx)
├── hooks/              # Feature queries/mutations (e.g. useProducts.ts)
├── services/           # Axios service calls (e.g. productApi.ts)
├── schemas/            # Zod validation schemas (e.g. productSchema.ts)
├── types/              # Feature TypeScript types (e.g. productTypes.ts)
└── index.ts            # Public exports
```

### 1. Adding an API Call with TanStack Query
```tsx
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await apiClient.get('/items')
      return res.data
    },
  })
}
```

### 2. Adding a Route with Code Splitting
In `src/routes/AppRoutes.tsx`:
```tsx
const ProductsPage = lazy(() => import('@/features/products/ProductsPage'))

// Inside routes array:
{
  path: 'products',
  element: (
    <Suspense fallback={<PageLoader />}>
      <ProductsPage />
    </Suspense>
  ),
}
```

### 3. Using UI Primitives
```tsx
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { SearchBar } from '@/components/ui/SearchBar'
import { StatsCard } from '@/components/ui/StatsCard'
import { Select } from '@/components/ui/Select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { toast } from 'sonner'
```
