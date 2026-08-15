import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/lib/auth';
import { PublicLayout } from '@/components/PublicLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { LoadingState } from '@/components/ui/States';

const Home = lazy(() => import('@/pages/Home'));
const Services = lazy(() => import('@/pages/Services'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetails = lazy(() => import('@/pages/ProjectDetails'));
const About = lazy(() => import('@/pages/About'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Testimonials = lazy(() => import('@/pages/Testimonials'));
const Contact = lazy(() => import('@/pages/Contact'));
const Quote = lazy(() => import('@/pages/Quote'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ProjectsManager = lazy(() => import('@/pages/admin/ProjectsManager'));
const ServicesManager = lazy(() => import('@/pages/admin/ServicesManager'));
const MessagesManager = lazy(() => import('@/pages/admin/MessagesManager'));
const QuotesManager = lazy(() => import('@/pages/admin/QuotesManager'));
const TestimonialsManager = lazy(() => import('@/pages/admin/TestimonialsManager'));
const PricingManager = lazy(() => import('@/pages/admin/PricingManager'));
const ContentManager = lazy(() => import('@/pages/admin/ContentManager'));
const Settings = lazy(() => import('@/pages/admin/Settings'));

const withSuspense = (el: React.ReactNode) => <Suspense fallback={<LoadingState message="Loading..." />}>{el}</Suspense>;

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: withSuspense(<Home />) },
      { path: '/services', element: withSuspense(<Services />) },
      { path: '/projects', element: withSuspense(<Projects />) },
      { path: '/projects/:slug', element: withSuspense(<ProjectDetails />) },
      { path: '/about', element: withSuspense(<About />) },
      { path: '/pricing', element: withSuspense(<Pricing />) },
      { path: '/testimonials', element: withSuspense(<Testimonials />) },
      { path: '/contact', element: withSuspense(<Contact />) },
      { path: '/quote', element: withSuspense(<Quote />) },
    ],
  },
  { path: '/admin/login', element: withSuspense(<AdminLogin />) },
  {
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { path: '/admin', element: withSuspense(<Dashboard />) },
      { path: '/admin/projects', element: withSuspense(<ProjectsManager />) },
      { path: '/admin/services', element: withSuspense(<ServicesManager />) },
      { path: '/admin/messages', element: withSuspense(<MessagesManager />) },
      { path: '/admin/quotes', element: withSuspense(<QuotesManager />) },
      { path: '/admin/testimonials', element: withSuspense(<TestimonialsManager />) },
      { path: '/admin/pricing', element: withSuspense(<PricingManager />) },
      { path: '/admin/content', element: withSuspense(<ContentManager />) },
      { path: '/admin/settings', element: withSuspense(<Settings />) },
    ],
  },
  { path: '*', element: <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="text-center"><h1 className="text-6xl font-bold text-navy-900">404</h1><p className="mt-4 text-slate-500">Page not found</p><a href="/" className="btn-primary mt-6 inline-flex">Go Home</a></div></div> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}
