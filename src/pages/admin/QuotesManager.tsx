import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Eye, Trash2, X, Loader2, FileText } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useQuotes, useUpdateQuote, useDeleteQuote } from '@/hooks/useData';
import { formatDateTime, cn } from '@/lib/utils';
import { QUOTE_STATUSES, type QuoteRequest } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-red-50 text-red-600', Contacted: 'bg-blue-50 text-blue-600', 'Proposal Sent': 'bg-purple-50 text-purple-600',
  Negotiation: 'bg-amber-50 text-amber-600', Approved: 'bg-emerald-50 text-emerald-600', Rejected: 'bg-slate-100 text-slate-500', Completed: 'bg-teal-50 text-teal-600',
};

export default function QuotesManager() {
  const { data: quotes, isLoading, isError, refetch } = useQuotes();
  const updateQuote = useUpdateQuote();
  const deleteQuote = useDeleteQuote();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<QuoteRequest | null>(null);

  const filtered = useMemo(() => { let list = quotes || []; if (filter !== 'All') list = list.filter((q) => q.status === filter); return list; }, [quotes, filter]);

  const handleStatusChange = async (id: string, status: string) => {
    try { await updateQuote.mutateAsync({ id, status }); toast.success(`Quote marked as ${status}.`); if (selected?.id === id) setSelected({ ...selected, status }); }
    catch (err: any) { toast.error(err.message || 'Unable to update status.'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await deleteQuote.mutateAsync(confirmDelete.id); toast.success('Quote deleted.'); setConfirmDelete(null); if (selected?.id === confirmDelete.id) setSelected(null); }
    catch (err: any) { toast.error(err.message || 'Unable to delete quote.'); }
  };

  return (
    <>
      <SEO title="Manage Quotes" />
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-navy-900">Quote Requests</h1><p className="mt-1 text-sm text-slate-500">View and manage project quote requests</p></div>
        <div className="flex flex-wrap gap-2">
          {['All', ...QUOTE_STATUSES].map((s) => <button key={s} onClick={() => setFilter(s)} className={cn('rounded-lg px-3 py-1.5 text-sm font-medium transition-all', filter === s ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-navy-600 hover:border-primary-300')}>{s}</button>)}
        </div>
        {isLoading ? <LoadingState message="Loading quotes..." /> : isError ? <ErrorState message="Unable to load quotes." onRetry={() => refetch()} /> : filtered.length === 0 ? <EmptyState title="No Quote Requests" description="Quote requests will appear here." /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Client</th><th className="hidden px-4 py-3 font-semibold md:table-cell">Project Type</th><th className="hidden px-4 py-3 font-semibold lg:table-cell">Budget</th><th className="hidden px-4 py-3 font-semibold lg:table-cell">Timeline</th><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((q) => (
                    <tr key={q.id} className={cn('transition-colors hover:bg-slate-50/60', q.status === 'New' && 'bg-primary-50/30')}>
                      <td className="px-4 py-3"><p className="font-semibold text-navy-900">{q.name}</p><p className="text-xs text-slate-500">{q.email}</p></td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{q.project_type || '—'}</td>
                      <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">{q.budget || '—'}</td>
                      <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">{q.timeline || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(q.created_at)}</td>
                      <td className="px-4 py-3"><span className={cn('badge', STATUS_COLORS[q.status] || 'bg-slate-100 text-slate-600')}>{q.status}</span></td>
                      <td className="px-4 py-3"><div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelected(q)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600" aria-label="View"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => setConfirmDelete(q)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {selected && <QuoteDetail quote={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
      {confirmDelete && <DeleteConfirm message={`Delete quote request from "${confirmDelete.name}"? This cannot be undone.`} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleteQuote.isPending} />}
    </>
  );
}

function QuoteDetail({ quote, onClose, onStatusChange }: { quote: QuoteRequest; onClose: () => void; onStatusChange: (id: string, status: string) => void }) {
  const fields = [
    { label: 'Email', value: quote.email }, { label: 'Phone', value: quote.phone },
    { label: 'Company', value: quote.company }, { label: 'Project Type', value: quote.project_type },
    { label: 'Budget', value: quote.budget }, { label: 'Timeline', value: quote.timeline },
    { label: 'Submitted', value: formatDateTime(quote.created_at) },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-6 py-4">
          <div><h2 className="text-lg font-bold text-navy-900">{quote.name}</h2><span className={cn('badge mt-1', STATUS_COLORS[quote.status] || 'bg-slate-100 text-slate-600')}>{quote.status}</span></div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-5 p-6">
          {quote.description && <div><h3 className="text-sm font-bold uppercase text-slate-400">Description</h3><p className="mt-1 whitespace-pre-line text-slate-700">{quote.description}</p></div>}
          {quote.features && quote.features.length > 0 && <div><h3 className="text-sm font-bold uppercase text-slate-400">Desired Features</h3><div className="mt-2 flex flex-wrap gap-2">{quote.features.map((f) => <span key={f} className="badge bg-primary-50 text-primary-700">{f}</span>)}</div></div>}
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.filter((f) => f.value).map((f) => <div key={f.label} className="rounded-lg border border-slate-100 p-3"><p className="text-xs text-slate-400">{f.label}</p><p className="text-sm font-semibold text-navy-900">{f.value}</p></div>)}
          </div>
          <div><h3 className="mb-2 text-sm font-bold uppercase text-slate-400">Update Status</h3><div className="flex flex-wrap gap-2">{QUOTE_STATUSES.map((s) => <button key={s} onClick={() => onStatusChange(quote.id, s)} className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition-all', quote.status === s ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-navy-600 hover:border-primary-300')}>{s}</button>)}</div></div>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteConfirm({ message, onCancel, onConfirm, loading }: { message: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-navy-900">Delete Quote Request</h3>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="btn-secondary">Cancel</button><button onClick={onConfirm} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete</button></div>
      </motion.div>
    </div>
  );
}
