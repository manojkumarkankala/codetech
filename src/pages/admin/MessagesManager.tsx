import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Eye, Trash2, X, Mail, Phone, MessageCircle, Loader2, Inbox } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useMessages, useUpdateMessage, useDeleteMessage } from '@/hooks/useData';
import { formatDateTime, getWhatsAppLink, cn } from '@/lib/utils';
import { MESSAGE_STATUSES, type Message } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  Unread: 'bg-red-50 text-red-600', Read: 'bg-blue-50 text-blue-600', Contacted: 'bg-purple-50 text-purple-600',
  'In Progress': 'bg-amber-50 text-amber-600', Completed: 'bg-emerald-50 text-emerald-600', Archived: 'bg-slate-100 text-slate-500',
};

export default function MessagesManager() {
  const { data: messages, isLoading, isError, refetch } = useMessages();
  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selected, setSelected] = useState<Message | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Message | null>(null);

  const filtered = useMemo(() => {
    let list = messages || [];
    if (filter !== 'All') list = list.filter((m) => m.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => [m.name, m.email, m.phone, m.service, m.subject, m.description].some((v) => v?.toLowerCase().includes(q)));
    }
    return list;
  }, [messages, filter, search]);

  const handleView = (m: Message) => {
    setSelected(m);
    if (m.status === 'Unread') { updateMessage.mutate({ id: m.id, status: 'Read' }); }
    setSearchParams({});
  };
  const handleStatusChange = async (id: string, status: string) => {
    try { await updateMessage.mutateAsync({ id, status }); toast.success(`Message marked as ${status}.`); if (selected?.id === id) setSelected({ ...selected, status }); }
    catch (err: any) { toast.error(err.message || 'Unable to update status.'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await deleteMessage.mutateAsync(confirmDelete.id); toast.success('Message deleted.'); setConfirmDelete(null); if (selected?.id === confirmDelete.id) setSelected(null); }
    catch (err: any) { toast.error(err.message || 'Unable to delete message.'); }
  };

  return (
    <>
      <SEO title="Manage Messages" />
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-navy-900">Client Messages</h1><p className="mt-1 text-sm text-slate-500">View and manage client enquiries</p></div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-10" placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...MESSAGE_STATUSES].map((s) => <button key={s} onClick={() => setFilter(s)} className={cn('rounded-lg px-3 py-1.5 text-sm font-medium transition-all', filter === s ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-navy-600 hover:border-primary-300')}>{s}</button>)}
          </div>
        </div>

        {isLoading ? <LoadingState message="Loading messages..." /> : isError ? <ErrorState message="Unable to load messages." onRetry={() => refetch()} /> : filtered.length === 0 ? <EmptyState title="No Messages Found" description="Client enquiries will appear here." /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">#</th><th className="px-4 py-3 font-semibold">Name</th><th className="hidden px-4 py-3 font-semibold md:table-cell">Service</th><th className="hidden px-4 py-3 font-semibold lg:table-cell">Budget</th><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((m, i) => (
                    <tr key={m.id} className={cn('transition-colors hover:bg-slate-50/60', m.status === 'Unread' && 'bg-primary-50/30')}>
                      <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3"><p className="font-semibold text-navy-900">{m.name}</p><p className="text-xs text-slate-500">{m.email}</p></td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{m.service || '—'}</td>
                      <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">{m.budget || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(m.created_at)}</td>
                      <td className="px-4 py-3"><span className={cn('badge', STATUS_COLORS[m.status] || 'bg-slate-100 text-slate-600')}>{m.status}</span></td>
                      <td className="px-4 py-3"><div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleView(m)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600" aria-label="View"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => setConfirmDelete(m)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selected && <MessageDetail message={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
      {confirmDelete && <DeleteConfirm message={`Delete message from "${confirmDelete.name}"? This cannot be undone.`} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleteMessage.isPending} />}
    </>
  );
}

function MessageDetail({ message, onClose, onStatusChange }: { message: Message; onClose: () => void; onStatusChange: (id: string, status: string) => void }) {
  const fields = [
    { label: 'Email', value: message.email, href: `mailto:${message.email}`, icon: Mail },
    { label: 'Phone', value: message.phone, href: message.phone ? `tel:${message.phone}` : undefined, icon: Phone },
    { label: 'Company', value: message.company },
    { label: 'Service', value: message.service },
    { label: 'Budget', value: message.budget },
    { label: 'Timeline', value: message.timeline },
    { label: 'Submitted', value: formatDateTime(message.created_at) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-6 py-4">
          <div><h2 className="text-lg font-bold text-navy-900">{message.name}</h2><span className={cn('badge mt-1', STATUS_COLORS[message.status] || 'bg-slate-100 text-slate-600')}>{message.status}</span></div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex gap-2">
            {message.email && <a href={`mailto:${message.email}`} className="btn-secondary flex-1 text-xs"><Mail className="h-4 w-4" /> Email</a>}
            {message.phone && <a href={`tel:${message.phone}`} className="btn-secondary flex-1 text-xs"><Phone className="h-4 w-4" /> Call</a>}
            {message.phone && <a href={getWhatsAppLink(message.phone, `Hello ${message.name}, thank you for contacting CodeTech.`)} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 text-xs"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
          </div>
          {message.subject && <div><h3 className="text-sm font-bold text-slate-400 uppercase">Subject</h3><p className="mt-1 font-semibold text-navy-900">{message.subject}</p></div>}
          {message.description && <div><h3 className="text-sm font-bold text-slate-400 uppercase">Message</h3><p className="mt-1 whitespace-pre-line text-slate-700">{message.description}</p></div>}
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.filter((f) => f.value).map((f) => (
              <div key={f.label} className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-400">{f.label}</p>
                {f.href ? <a href={f.href} className="text-sm font-semibold text-primary-600 hover:text-primary-700">{f.value}</a> : <p className="text-sm font-semibold text-navy-900">{f.value}</p>}
              </div>
            ))}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-400 uppercase">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_STATUSES.map((s) => <button key={s} onClick={() => onStatusChange(message.id, s)} className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition-all', message.status === s ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-navy-600 hover:border-primary-300')}>{s}</button>)}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteConfirm({ message, onCancel, onConfirm, loading }: { message: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-navy-900">Delete Message</h3>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="btn-secondary">Cancel</button><button onClick={onConfirm} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete</button></div>
      </motion.div>
    </div>
  );
}
