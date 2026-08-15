import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X, Save, Loader2, Star, Upload, Image as ImageIcon } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useTestimonials, useSaveTestimonial, useDeleteTestimonial } from '@/hooks/useData';
import { uploadImage, validateImageFile } from '@/lib/storage';
import { formatDate, cn } from '@/lib/utils';
import type { Testimonial } from '@/types';

const EMPTY: Partial<Testimonial> = { client_name: '', company: '', role: '', profile_image: '', rating: 5, review: '', review_date: new Date().toISOString().split('T')[0], published: true, display_order: 0 };

export default function TestimonialsManager() {
  const { data: testimonials, isLoading, isError, refetch } = useTestimonials();
  const saveTestimonial = useSaveTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null);

  const handleSave = async (data: Partial<Testimonial>) => {
    try { await saveTestimonial.mutateAsync({ ...data, rating: Number(data.rating) }); toast.success(data.id ? 'Testimonial updated successfully.' : 'Testimonial added successfully.'); setEditing(null); }
    catch (err: any) { toast.error(err.message || 'Unable to save testimonial.'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await deleteTestimonial.mutateAsync(confirmDelete.id); toast.success('Testimonial deleted successfully.'); setConfirmDelete(null); }
    catch (err: any) { toast.error(err.message || 'Unable to delete testimonial.'); }
  };

  return (
    <>
      <SEO title="Manage Testimonials" />
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-2xl font-bold text-navy-900">Testimonials</h1><p className="mt-1 text-sm text-slate-500">Manage client reviews and testimonials</p></div>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary"><Plus className="h-4 w-4" /> Add Testimonial</button>
        </div>
        {isLoading ? <LoadingState message="Loading testimonials..." /> : isError ? <ErrorState message="Unable to load testimonials." onRetry={() => refetch()} /> : (testimonials || []).length === 0 ? (
          <EmptyState title="No Testimonials Yet" description="Add your first client testimonial." action={<button onClick={() => setEditing({ ...EMPTY })} className="btn-primary mt-4"><Plus className="h-4 w-4" /> Add Testimonial</button>} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(testimonials || []).map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {t.profile_image ? <img src={t.profile_image} alt={t.client_name} className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white">{t.client_name.charAt(0)}</div>}
                    <div><h3 className="font-semibold text-navy-900">{t.client_name}</h3><p className="text-xs text-slate-500">{[t.role, t.company].filter(Boolean).join(', ')}</p></div>
                  </div>
                  <span className={cn('badge', t.published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>{t.published ? 'Published' : 'Draft'}</span>
                </div>
                <div className="mt-3 flex gap-0.5">{Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className={cn('h-4 w-4', idx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />)}</div>
                <p className="mt-3 text-sm text-slate-500 line-clamp-3">{t.review}</p>
                <p className="mt-2 text-xs text-slate-400">{formatDate(t.review_date)}</p>
                <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3"><button onClick={() => setEditing({ ...t })} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600" aria-label="Edit"><Edit className="h-4 w-4" /></button><button onClick={() => setConfirmDelete(t)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {editing && <TestimonialForm testimonial={editing} onClose={() => setEditing(null)} onSave={handleSave} saving={saveTestimonial.isPending} />}
      {confirmDelete && <DeleteConfirm message={`Delete testimonial from "${confirmDelete.client_name}"? This cannot be undone.`} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleteTestimonial.isPending} />}
    </>
  );
}

function TestimonialForm({ testimonial, onClose, onSave, saving }: { testimonial: Partial<Testimonial>; onClose: () => void; onSave: (t: Partial<Testimonial>) => void; saving: boolean }) {
  const [form, setForm] = useState<Partial<Testimonial>>(testimonial);
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof Testimonial, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const handleUpload = async (file: File) => {
    const err = validateImageFile(file); if (err) { toast.error(err); return; }
    setUploading(true);
    try { const { url, error } = await uploadImage('testimonial-images', file); if (error) throw new Error(error); set('profile_image', url); toast.success('Image uploaded.'); } catch (e: any) { toast.error(e.message || 'Upload failed.'); } finally { setUploading(false); }
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!form.client_name || !form.review) { toast.error('Name and review are required.'); return; } onSave(form); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-6 py-4"><h2 className="text-lg font-bold text-navy-900">{form.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Client Name *</label><input className="input" value={form.client_name || ''} onChange={(e) => set('client_name', e.target.value)} required /></div>
            <div><label className="label">Company</label><input className="input" value={form.company || ''} onChange={(e) => set('company', e.target.value)} /></div>
            <div><label className="label">Role</label><input className="input" value={form.role || ''} onChange={(e) => set('role', e.target.value)} placeholder="CEO, Founder..." /></div>
            <div><label className="label">Rating</label><select className="input" value={form.rating || 5} onChange={(e) => set('rating', Number(e.target.value))}>{[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}</select></div>
          </div>
          <div><label className="label">Review *</label><textarea className="input min-h-[120px]" value={form.review || ''} onChange={(e) => set('review', e.target.value)} required /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Review Date</label><input type="date" className="input" value={form.review_date || ''} onChange={(e) => set('review_date', e.target.value)} /></div>
            <div><label className="label">Display Order</label><input type="number" className="input" value={form.display_order ?? 0} onChange={(e) => set('display_order', Number(e.target.value))} /></div>
          </div>
          <div><label className="label">Profile Image</label>
            <div className="flex items-center gap-4">
              {form.profile_image ? <div className="relative"><img src={form.profile_image} alt="Profile" className="h-20 w-20 rounded-full border border-slate-200 object-cover" /><button type="button" onClick={() => set('profile_image', '')} className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"><X className="h-3.5 w-3.5" /></button></div> : <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-50"><ImageIcon className="h-7 w-7 text-slate-300" /></div>}
              <label className="btn-secondary cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} /></label>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={form.published || false} onChange={(e) => set('published', e.target.checked)} /> Published</label>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Testimonial</button></div>
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
