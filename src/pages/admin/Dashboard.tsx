import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FolderKanban, CheckCircle, Wrench, Inbox, FileText, Star, ArrowRight, Mail, Clock,
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState } from '@/components/ui/States';
import { useDashboardStats, useMessages, useProjects } from '@/hooks/useData';
import { formatDate, truncate } from '@/lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: messages } = useMessages();
  const { data: projects } = useProjects();

  if (isLoading) return <><SEO title="Dashboard" /><LoadingState message="Loading dashboard..." /></>;

  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects ?? 0, icon: FolderKanban, color: 'from-primary-500 to-primary-600' },
    { label: 'Active Projects', value: stats?.activeProjects ?? 0, icon: Clock, color: 'from-amber-400 to-orange-500' },
    { label: 'Completed Projects', value: stats?.completedProjects ?? 0, icon: CheckCircle, color: 'from-emerald-400 to-teal-500' },
    { label: 'Total Services', value: stats?.totalServices ?? 0, icon: Wrench, color: 'from-accent-400 to-cyan-500' },
    { label: 'Total Messages', value: stats?.totalMessages ?? 0, icon: Inbox, color: 'from-blue-500 to-indigo-500' },
    { label: 'Unread Messages', value: stats?.unreadMessages ?? 0, icon: Mail, color: 'from-red-400 to-pink-500' },
    { label: 'Quote Requests', value: stats?.quoteRequests ?? 0, icon: FileText, color: 'from-purple-400 to-violet-500' },
    { label: 'Testimonials', value: stats?.totalTestimonials ?? 0, icon: Star, color: 'from-yellow-400 to-amber-500' },
  ];

  const recentMessages = (messages || []).slice(0, 5);
  const recentProjects = (projects || []).slice(0, 4);

  return (
    <>
      <SEO title="Dashboard" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back to your CodeTech admin panel.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white`}><card.icon className="h-5 w-5" /></div>
              <p className="mt-3 text-2xl font-bold text-navy-900">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-navy-900">Recent Messages</h2>
              <Link to="/admin/messages" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All <ArrowRight className="inline h-3.5 w-3.5" /></Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentMessages.length === 0 ? <p className="py-8 text-center text-sm text-slate-400">No messages yet.</p> : recentMessages.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-navy-900">{m.name}</p><p className="truncate text-xs text-slate-500">{m.subject || m.service || 'No subject'}</p></div>
                  <span className={`badge ml-3 flex-shrink-0 ${m.status === 'Unread' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-navy-900">Recent Projects</h2>
              <Link to="/admin/projects" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All <ArrowRight className="inline h-3.5 w-3.5" /></Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentProjects.length === 0 ? <p className="py-8 text-center text-sm text-slate-400">No projects yet.</p> : recentProjects.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                  {p.cover_image ? <img src={p.cover_image} alt={p.title} className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" /> : <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400"><FolderKanban className="h-5 w-5" /></div>}
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-navy-900">{p.title}</p><p className="text-xs text-slate-500">{truncate(p.category, 20)} • {formatDate(p.updated_at)}</p></div>
                  <span className={`badge flex-shrink-0 ${p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
