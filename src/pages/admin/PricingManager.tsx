import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X, Save, Loader2, DollarSign, Star, Sparkles } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { usePricing, useSavePricing, useDeletePricing } from '@/hooks/useData';
import { formatCurrency, cn } from '@/lib/utils';
import type { PricingPackage } from '@/types';

const EMPTY: Partial<PricingPackage> = { name: '', price: 0, currency: 'INR', description: '', features: [], popular: false, active: true, display_order: 0 };

export default function PricingManager() {
  const { data: pricing, isLoading, isError, refetch } = usePricing();
  const savePricing = useSavePricing();
  const deletePricing = useDeletePricing();
  const [editing, setEditing] = useState<Partial<PricingPackage> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PricingPackage | null>(null);

  const handleSave = async (data: Partial<PricingPackage>) => {
    try { await savePricing.mutateAsync({ ...data, price: Number(data.price) }); toast.success(data.id ? 'Package updated successfully.' : 'Package added successfully.'); setEditing(null); }
    catch (err: any) { toast.error(err.message || 'Unable to save package.'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await deletePricing.mutateAsync(confirmDelete.id); toast.success('Package deleted successfully.'); setConfirmDelete(null); }
    catch (err: any) { toast.error(err.message || 'Unable to delete package.'); }
  };

  return (
    <>
      <SEO title="Manage Pricing" />
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-2xl font-bold text-navy-900">Pricing Packages</h1><p className="mt-1 text-sm text-slate-500">Manage pricing packages displayed on the website</p></div>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary"><Plus className="h-4 w-4" /> Add Package</button>
        </div>
        {isLoading ? <LoadingState message="Loading packages..." /> : isError ? <ErrorState message="Unable to load packages." onRetry={() => refetch()} /> : (pricing || []).length === 0 ? (
          <EmptyState title="No Packages Yet" description="Add your first pricing package." action={<button onClick={() => setEditing({ ...EMPTY })} className="btn-primary mt-4"><Plus className="h-4 w-4" /> Add Package</button>} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(pricing || []).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={cn('card p-5', p.popular && 'ring-2 ring-primary-500/20')}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><DollarSign className="h-5 w-5" /></div><h3 className="font-semibold text-navy-900">{p.name}</h3></div>
                  {p.popular && <span className="badge bg-primary-50 text-primary-700"><Sparkles className="h-3 w-3" /> Popular</span>}
                </div>
                <p className="mt-3 text-2xl font-bold text-navy-900">{p.price === 0 ? 'Custom' : formatCurrency(p.price, p.currency)}</p>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.description}</p>
                <div className="mt-3"><span className={cn('badge', p.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>{p.active ? 'Active' : 'Inactive'}</span></div>
                <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3"><button onClick={() => setEditing({ ...p })} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600" aria-label="Edit"><Edit className="h-4 w-4" /></button><button onClick={() => setConfirmDelete(p)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {editing && <PricingForm pkg={editing} onClose={() => setEditing(null)} onSave={handleSave} saving={savePricing.isPending} />}
      {confirmDelete && <DeleteConfirm message={`Delete "${confirmDelete.name}"? This cannot be undone.`} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deletePricing.isPending} />}
    </>
  );
}

function PricingForm({ pkg, onClose, onSave, saving }: { pkg: Partial<PricingPackage>; onClose: () => void; onSave: (p: Partial<PricingPackage>) => void; saving: boolean }) {
  const [form, setForm] = useState<Partial<PricingPackage>>(pkg);
  const [featureInput, setFeatureInput] = useState('');
  const set = (k: keyof PricingPackage, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const addFeature = () => { const v = featureInput.trim(); if (v && !(form.features || []).includes(v)) { set('features', [...(form.features || []), v]); setFeatureInput(''); } };
  const removeFeature = (f: string) => set('features', (form.features || []).filter((x: string) => x !== f));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!form.name) { toast.error('Package name is required.'); return; } onSave(form); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-6 py-4"><h2 className="text-lg font-bold text-navy-900">{form.id ? 'Edit Package' : 'Add Package'}</h2><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1"><label className="label">Package Name *</label><input className="input" value={form.name || ''} onChange={(e) => set('name', e.target.value)} required /></div>
            <div><label className="label">Price</label><input type="number" className="input" value={form.price ?? 0} onChange={(e) => set('price', e.target.value)} /></div>
            <div><label className="label">Currency</label><select className="input" value={form.currency || 'INR'} onChange={(e) => set('currency', e.target.value)}><option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select></div>
          </div>
          <div><label className="label">Description</label><textarea className="input min-h-[60px]" value={form.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
          <div><label className="label">Features</label><div className="flex gap-2"><input className="input" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }} placeholder="Add a feature..." /><button type="button" onClick={addFeature} className="btn-secondary flex-shrink-0">Add</button></div>
            {(form.features || []).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{(form.features || []).map((f: string) => <span key={f} className="badge bg-primary-50 text-primary-700">{f}<button type="button" onClick={() => removeFeature(f)} className="ml-1 hover:text-primary-900">&times;</button></span>)}</div>}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div><label className="label">Display Order</label><input type="number" className="input" value={form.display_order ?? 0} onChange={(e) => set('display_order', Number(e.target.value))} /></div>
            <label className="flex items-center gap-2 pt-6 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={form.popular || false} onChange={(e) => set('popular', e.target.checked)} /> Mark as Popular</label>
            <label className="flex items-center gap-2 pt-6 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={form.active || false} onChange={(e) => set('active', e.target.checked)} /> Active</label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Package</button></div>
        </form>
      </motion.div>
    </div>
  );
}

function DeleteConfirm({ message, onCancel, onConfirm, loading }: { message: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-navy-900">Confirm Delete</h3>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="btn-secondary">Cancel</button><button onClick={onConfirm} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete</button></div>
      </motion.div>
    </div>
  );
}
