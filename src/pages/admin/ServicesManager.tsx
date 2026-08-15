import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X, Save, Loader2, Wrench, Star, Upload, Image as ImageIcon } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useServices, useSaveService, useDeleteService } from '@/hooks/useData';
import { uploadImage, validateImageFile } from '@/lib/storage';
import { formatCurrency, slugify, cn } from '@/lib/utils';
import type { Service } from '@/types';

const EMPTY: Partial<Service> = {
  name: '', slug: '', icon: 'Code', image: '', short_description: '', description: '',
  features: [], starting_price: null, currency: 'INR', featured: false, active: true, display_order: 0,
};

const ICON_OPTIONS = ['Code', 'ShoppingCart', 'Home', 'Briefcase', 'Brain', 'Smartphone', 'RefreshCw', 'Settings', 'Search', 'Palette', 'Zap', 'ShieldCheck', 'Globe', 'Server', 'Database', 'Rocket', 'LifeBuoy', 'Sparkles'];

export default function ServicesManager() {
  const { data: services, isLoading, isError, refetch } = useServices();
  const saveService = useSaveService();
  const deleteService = useDeleteService();
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);

  const handleSave = async (data: Partial<Service>) => {
    try { await saveService.mutateAsync({ ...data, starting_price: data.starting_price === null ? null : Number(data.starting_price) }); toast.success(data.id ? 'Service updated successfully.' : 'Service added successfully.'); setEditing(null); }
    catch (err: any) { toast.error(err.message || 'Unable to save service.'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await deleteService.mutateAsync(confirmDelete.id); toast.success('Service deleted successfully.'); setConfirmDelete(null); }
    catch (err: any) { toast.error(err.message || 'Unable to delete service.'); }
  };

  return (
    <>
      <SEO title="Manage Services" />
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-2xl font-bold text-navy-900">Services</h1><p className="mt-1 text-sm text-slate-500">Manage all services offered</p></div>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary"><Plus className="h-4 w-4" /> Add Service</button>
        </div>
        {isLoading ? <LoadingState message="Loading services..." /> : isError ? <ErrorState message="Unable to load services." onRetry={() => refetch()} /> : (services || []).length === 0 ? (
          <EmptyState title="No Services Yet" description="Add your first service." action={<button onClick={() => setEditing({ ...EMPTY })} className="btn-primary mt-4"><Plus className="h-4 w-4" /> Add Service</button>} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(services || []).map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {s.image ? <img src={s.image} alt={s.name} className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white"><Wrench className="h-6 w-6" /></div>}
                    <div><h3 className="font-semibold text-navy-900">{s.name}</h3><p className="text-xs text-slate-500">{s.slug}</p></div>
                  </div>
                  {s.featured && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                </div>
                <p className="mt-3 text-sm text-slate-500 line-clamp-2">{s.short_description}</p>
                <div className="mt-3 flex items-center gap-2">
                  {s.starting_price !== null && <span className="text-sm font-bold text-primary-700">{formatCurrency(s.starting_price, s.currency)}</span>}
                  <span className={cn('badge ml-auto', s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>{s.active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                  <button onClick={() => setEditing({ ...s })} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600" aria-label="Edit"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => setConfirmDelete(s)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {editing && <ServiceForm service={editing} onClose={() => setEditing(null)} onSave={handleSave} saving={saveService.isPending} />}
      {confirmDelete && <DeleteConfirm title="Delete Service" message={`Delete "${confirmDelete.name}"? This cannot be undone.`} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleteService.isPending} />}
    </>
  );
}

function ServiceForm({ service, onClose, onSave, saving }: { service: Partial<Service>; onClose: () => void; onSave: (s: Partial<Service>) => void; saving: boolean }) {
  const [form, setForm] = useState<Partial<Service>>(service);
  const [featureInput, setFeatureInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof Service, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const addFeature = () => { const v = featureInput.trim(); if (v && !(form.features || []).includes(v)) { set('features', [...(form.features || []), v]); setFeatureInput(''); } };
  const removeFeature = (f: string) => set('features', (form.features || []).filter((x: string) => x !== f));
  const handleUpload = async (file: File) => {
    const err = validateImageFile(file); if (err) { toast.error(err); return; }
    setUploading(true);
    try { const { url, error } = await uploadImage('service-images', file); if (error) throw new Error(error); set('image', url); toast.success('Image uploaded.'); } catch (e: any) { toast.error(e.message || 'Upload failed.'); } finally { setUploading(false); }
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!form.name || !form.slug) { toast.error('Name and slug are required.'); return; } onSave(form); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-navy-900">{form.id ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Service Name *</label><input className="input" value={form.name || ''} onChange={(e) => { set('name', e.target.value); set('slug', slugify(e.target.value)); }} required /></div>
            <div><label className="label">Slug *</label><input className="input" value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} required /></div>
          </div>
          <div><label className="label">Short Description</label><textarea className="input min-h-[60px]" value={form.short_description || ''} onChange={(e) => set('short_description', e.target.value)} /></div>
          <div><label className="label">Full Description</label><textarea className="input min-h-[100px]" value={form.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="grid gap-4 md:grid-cols-3">
            <div><label className="label">Starting Price</label><input type="number" className="input" value={form.starting_price ?? ''} onChange={(e) => set('starting_price', e.target.value ? Number(e.target.value) : null)} placeholder="10000" /></div>
            <div><label className="label">Currency</label><select className="input" value={form.currency || 'INR'} onChange={(e) => set('currency', e.target.value)}><option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select></div>
            <div><label className="label">Icon</label><select className="input" value={form.icon || 'Code'} onChange={(e) => set('icon', e.target.value)}>{ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></div>
          </div>
          <div><label className="label">Features</label><div className="flex gap-2"><input className="input" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }} placeholder="Add a feature..." /><button type="button" onClick={addFeature} className="btn-secondary flex-shrink-0">Add</button></div>
            {(form.features || []).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{(form.features || []).map((f: string) => <span key={f} className="badge bg-primary-50 text-primary-700">{f}<button type="button" onClick={() => removeFeature(f)} className="ml-1 hover:text-primary-900">&times;</button></span>)}</div>}
          </div>
          <div><label className="label">Service Image</label>
            <div className="flex items-center gap-4">
              {form.image ? <div className="relative"><img src={form.image} alt="Service" className="h-20 w-20 rounded-xl border border-slate-200 object-cover" /><button type="button" onClick={() => set('image', '')} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"><X className="h-3.5 w-3.5" /></button></div> : <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50"><ImageIcon className="h-7 w-7 text-slate-300" /></div>}
              <label className="btn-secondary cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} /></label>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={form.featured || false} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={form.active || false} onChange={(e) => set('active', e.target.checked)} /> Active</label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Service</button></div>
        </form>
      </motion.div>
    </div>
  );
}

function DeleteConfirm({ title, message, onCancel, onConfirm, loading }: { title: string; message: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-navy-900">{title}</h3>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="btn-secondary">Cancel</button><button onClick={onConfirm} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete</button></div>
      </motion.div>
    </div>
  );
}
