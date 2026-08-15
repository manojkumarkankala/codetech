import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Wrench, Inbox, FileText,
  Star, DollarSign, FileEdit, Settings, LogOut, Menu, X, Bell, Search,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useMessages } from '@/hooks/useData';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Services', to: '/admin/services', icon: Wrench },
  { label: 'Messages', to: '/admin/messages', icon: Inbox },
  { label: 'Quote Requests', to: '/admin/quotes', icon: FileText },
  { label: 'Testimonials', to: '/admin/testimonials', icon: Star },
  { label: 'Pricing', to: '/admin/pricing', icon: DollarSign },
  { label: 'Website Content', to: '/admin/content', icon: FileEdit },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: messages } = useMessages();
  const unreadCount = (messages || []).filter((m) => m.status === 'Unread').length;

  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname === to || pathname.startsWith(to + '/');
  const handleLogout = async () => { await signOut(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-slate-50/80">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <SidebarContent isActive={isActive} onLogout={handleLogout} unreadCount={unreadCount} />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-navy-900/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'tween', duration: 0.2 }} className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white lg:hidden">
              <SidebarContent isActive={isActive} onLogout={handleLogout} unreadCount={unreadCount} onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md lg:px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6 text-navy-700" /></button>
          <div className="relative hidden flex-1 max-w-xs md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." className="input pl-10 py-2 text-sm" onChange={(e) => { const q = e.target.value.trim(); if (q) navigate(`/admin/messages?q=${encodeURIComponent(q)}`); }} />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/admin/messages" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-navy-600 transition-colors hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">{unreadCount}</span>}
            </Link>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white">{(user?.email?.[0] || 'A').toUpperCase()}</div>
              <div className="hidden sm:block"><p className="text-xs font-semibold text-navy-900">Administrator</p><p className="text-xs text-slate-400">{user?.email}</p></div>
            </div>
            <button onClick={handleLogout} className="flex h-10 w-10 items-center justify-center rounded-xl text-navy-600 transition-colors hover:bg-red-50 hover:text-red-600" aria-label="Logout"><LogOut className="h-5 w-5" /></button>
          </div>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

function SidebarContent({ isActive, onLogout, unreadCount, onClose }: { isActive: (to: string, exact?: boolean) => boolean; onLogout: () => void; unreadCount: number; onClose?: () => void; }) {
  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white"><span className="text-sm font-bold">C</span></div>
          <div><p className="text-sm font-bold text-navy-900">CodeTech</p><p className="text-xs text-slate-400">Admin Panel</p></div>
        </Link>
        {onClose && <button onClick={onClose} className="text-slate-400 hover:text-navy-700 lg:hidden"><X className="h-5 w-5" /></button>}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} onClick={onClose} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all', isActive(item.to, item.exact) ? 'bg-primary-50 text-primary-700' : 'text-navy-600 hover:bg-slate-50 hover:text-navy-900')}>
            <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive(item.to, item.exact) ? 'text-primary-600' : 'text-slate-400')} />
            <span>{item.label}</span>
            {item.label === 'Messages' && unreadCount > 0 && <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">{unreadCount}</span>}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3"><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"><LogOut className="h-5 w-5" /> Logout</button></div>
    </>
  );
}
