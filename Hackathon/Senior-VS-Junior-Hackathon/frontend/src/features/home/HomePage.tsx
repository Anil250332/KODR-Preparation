import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Server,
  Zap,
  CheckCircle2,
  Bell,
  Sliders,
  ShieldCheck,
  Send,
  Database,
  Layers,
  Code2,
  Clock,
  Sparkles,
} from 'lucide-react'

import { apiClient } from '@/lib/axios'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/ui/FormField'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatsCard } from '@/components/ui/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { SearchBar } from '@/components/ui/SearchBar'
import { Select } from '@/components/ui/Select'

// Sample Zod validation schema
const testSchema = z.object({
  featureName: z.string().min(3, 'Feature name must be at least 3 characters'),
  authorEmail: z.string().email('Please enter a valid email address'),
  category: z.string().min(1, 'Please select a category'),
})

type TestFormData = z.infer<typeof testSchema>

export function HomePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchOutput, setSearchOutput] = useState('')
  const dispatch = useAppDispatch()
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen)

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      featureName: '',
      authorEmail: '',
      category: '',
    },
  })

  // TanStack Query API check (hits backend /health)
  const {
    data: healthData,
    isLoading: isCheckingHealth,
    isError: isHealthError,
    refetch: checkHealth,
  } = useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      const response = await apiClient.get('/health')
      return response.data
    },
    enabled: false,
  })

  const onSubmit = (data: TestFormData) => {
    toast.success(`Form Validated: ${data.featureName} (${data.category})`)
    reset()
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-zinc-900 p-6 sm:p-10 text-white shadow-lg">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
            <Zap className="w-3.5 h-3.5" />
            Hackathon Production Starter &bull; Frontend Ready
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Build. Zero Overhead.
          </h1>
          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
            Pre-configured with Tailwind v4, React 19, TypeScript, Dark Mode, Redux Toolkit,
            TanStack Query, Axios, Zod, and full shadcn component primitives.
          </p>
        </div>
      </div>

      {/* Top Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Architecture Status"
          value="100% Ready"
          change="Clean Build"
          trend="up"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          description="0 type errors, 0 warnings"
        />
        <StatsCard
          title="UI Primitives"
          value="14 Blocks"
          change="shadcn Compatible"
          trend="up"
          icon={<Layers className="w-5 h-5 text-indigo-600" />}
          description="Buttons, Cards, Dialogs, Tables"
        />
        <StatsCard
          title="State & Cache"
          value="Redux + Query"
          change="Client & Server"
          trend="neutral"
          icon={<Sliders className="w-5 h-5 text-indigo-600" />}
          description="Unified async & sync states"
        />
        <StatsCard
          title="Validation"
          value="Zod v4"
          change="Type-safe Forms"
          trend="up"
          icon={<Code2 className="w-5 h-5 text-emerald-600" />}
          description="React Hook Form integration"
        />
      </div>

      {/* Main Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Architecture Overview</TabsTrigger>
          <TabsTrigger value="form-demo">Form & Search Demo</TabsTrigger>
          <TabsTrigger value="components">UI Components Library</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Backend API Connectivity Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="w-4 h-4 text-indigo-600" />
                  Backend Connection Check
                </CardTitle>
                <CardDescription>
                  Test Axios + TanStack Query integration with your backend API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
                  Base URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}
                </div>

                {isCheckingHealth ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : healthData ? (
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <div className="font-semibold">Backend Responded!</div>
                      <pre className="mt-1 text-[11px] overflow-auto">
                        {JSON.stringify(healthData, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : isHealthError ? (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                    Backend not reachable yet (start backend at port 5000).
                  </div>
                ) : null}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => checkHealth()}
                  isLoading={isCheckingHealth}
                  className="w-full"
                >
                  Test GET /health
                </Button>
              </CardContent>
            </Card>

            {/* 2. Redux Client State Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Redux Global State
                </CardTitle>
                <CardDescription>
                  Client-side state managed via slices and typed hooks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">ui.isSidebarOpen:</span>
                  <Badge variant={isSidebarOpen ? 'success' : 'secondary'}>
                    {String(isSidebarOpen)}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dispatch(toggleSidebar())}
                    className="flex-1"
                  >
                    Toggle Redux Flag
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toast.success('Sonner Toast notification working!')}
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Toast
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 3. Reusable Dialog Modal Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Accessible Dialog Modal
                </CardTitle>
                <CardDescription>
                  Accessible modal with backdrop blur & smooth transitions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-zinc-500">
                  Ready for forms, confirmation alerts, and dynamic popups.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  className="w-full"
                >
                  Open Dialog Modal
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Form & Search Demo */}
        <TabsContent value="form-demo" id="form-demo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Validation (React Hook Form + Zod) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Send className="w-4 h-4 text-indigo-600" />
                  Type-Safe Form (RHF + Zod)
                </CardTitle>
                <CardDescription>
                  Separation of schemas from UI with immediate validation errors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    label="Feature / Module Name"
                    error={errors.featureName?.message}
                    required
                  >
                    <Input
                      placeholder="e.g. user-auth, task-manager"
                      error={Boolean(errors.featureName)}
                      {...register('featureName')}
                    />
                  </FormField>

                  <FormField
                    label="Author / Contact Email"
                    error={errors.authorEmail?.message}
                    required
                  >
                    <Input
                      type="email"
                      placeholder="e.g. dev@hackathon.edu"
                      error={Boolean(errors.authorEmail)}
                      {...register('authorEmail')}
                    />
                  </FormField>

                  <FormField
                    label="Project Track / Category"
                    error={errors.category?.message}
                    required
                  >
                    <Select
                      error={Boolean(errors.category)}
                      options={[
                        { label: 'Select Track', value: '' },
                        { label: 'AI & Machine Learning', value: 'ai' },
                        { label: 'Web3 & Fintech', value: 'fintech' },
                        { label: 'Social Good & Healthcare', value: 'health' },
                        { label: 'Open Innovation', value: 'open' },
                      ]}
                      {...register('category')}
                    />
                  </FormField>

                  <div className="pt-2">
                    <Button type="submit" size="md" isLoading={isSubmitting} className="w-full">
                      Submit Validated Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Debounced Search Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Debounced Live Search
                </CardTitle>
                <CardDescription>
                  Powered by <code>useDebounce</code> (300ms delay) to prevent spamming APIs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SearchBar
                  placeholder="Type to test debounced search..."
                  onSearch={(q) => setSearchOutput(q)}
                />
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm">
                  <span className="text-zinc-500 text-xs block mb-1">Debounced Output:</span>
                  <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {searchOutput ? `"${searchOutput}"` : '(waiting for input...)'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: UI Components Showcase */}
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Reusable UI Primitives Ready
              </CardTitle>
              <CardDescription>
                Copy & paste or import directly into your features when the problem statement arrives:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badges */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Status Badges
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Completed</Badge>
                  <Badge variant="warning">In Review</Badge>
                  <Badge variant="destructive">Rejected</Badge>
                  <Badge variant="secondary">Draft</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Button Variants
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="ghost" size="sm">Ghost</Button>
                  <Button variant="destructive" size="sm">Destructive</Button>
                  <Button variant="default" size="sm" isLoading>Loading</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feature Folder Architecture Reminder */}
      <Card id="architecture">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="w-4 h-4 text-indigo-600" />
            Feature-Based Folder Structure Ready
          </CardTitle>
          <CardDescription>
            When problem statement arrives, build cleanly inside <code>src/features/[feature-name]/</code>:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">components/</div>
              <p className="text-zinc-500 mt-1">Feature-specific UI pieces</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">hooks/</div>
              <p className="text-zinc-500 mt-1">useQuery & custom business hooks</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">services/</div>
              <p className="text-zinc-500 mt-1">Axios API service calls</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">schemas/ & types/</div>
              <p className="text-zinc-500 mt-1">Zod schemas & TypeScript types</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Modal Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Reusable Dialog Active"
        description="This modal is ready for forms, confirmation alerts, and dynamic popups."
      >
        <div className="space-y-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Press <strong>Escape</strong> or click outside to dismiss. Fully accessible, clean, and styled with Tailwind CSS.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                toast.success('Action Confirmed!')
                setIsDialogOpen(false)
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
export default HomePage
