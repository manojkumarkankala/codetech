import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Plus, Edit, Trash2, Eye, Copy, X, Save, Loader2, Upload, Image as ImageIcon, FolderKanban, Star,
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import {
  useProjects, useSaveProject, useDeleteProject, useProjectImages, useSaveProjectImage, useDeleteProjectImage,
} from '@/hooks/useData';
import { uploadImage, deleteImage, validateImageFile } from '@/lib/storage';
import { formatCurrency, formatDate, slugify, cn } from '@/lib/utils';
import { PROJECT_CATEGORIES, PROJECT_STATUSES, type Project } from '@/types';

const EMPTY: Partial<Project> = {
  title: '', slug: '', category: 'Business', client_name: '', price: null, currency: 'INR',
  short_description: '', description: '', problem: '', solution: '', features: '',
  challenges: '', results: '', technologies: [], cover_image: '', live_url: '', github_url: '', demo_url: '',
  status: 'Completed', featured: false, published: true, show_price: true, display_order: 0,
  start_date: null, completion_date: null,
};

export default function ProjectsManager() {
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const saveProject = useSaveProject();
  const deleteProject = useDeleteProject();
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);

  const handleEdit = (p: Project) => setEditing({ ...p });
  const handleNew = () => setEditing({ ...EMPTY });
  const handleDuplicate = async (p: Project) => {
    try {
      await saveProject.mutateAsync({ ...EMPTY, title: `${p.title} (Copy)`, slug: slugify(`${p.title}-copy-${Date.now()}`), category: p.category, short_description: p.short_description, description: p.description, technologies: p.technologies, price: p.price, currency: p.currency, status: 'Planning', featured: false, published: false });
      toast.success('Project duplicated successfully.');
    } catch (err: any) { toast.error(err.message || 'Unable to duplicate project.'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await deleteProject.mutateAsync(confirmDelete.id); toast.success('Project deleted successfully.'); setConfirmDelete(null); }
    catch (err: any) { toast.error(err.message || 'Unable to delete project.'); }
  };

  return (
    <>
      <SEO title="Manage Projects" />
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-2xl font-bold text-navy-900">Projects</h1><p className="mt-1 text-sm text-slate-500">Manage all CodeTech projects</p></div>
          <button onClick={handleNew} className="btn-primary"><Plus className="h-4 w-4" /> Add New Project</button>
        </div>
        {isLoading ? <LoadingState message="Loading projects..." /> : isError ? <ErrorState message="Unable to load projects." onRetry={() => refetch()} /> : (projects || []).length === 0 ? <EmptyState title="No Projects Yet" description="Start by adding your first project." action={<button onClick={handleNew} className="btn-primary mt-4"><Plus className="h-4 w-4" /> Add Project</button>} /> : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(projects || []).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card overflow-hidden">
                <div className="relative h-36 bg-slate-100">
                  {p.cover_image ? <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><FolderKanban className="h-10 w-10 text-slate-300" /></div>}
                  <div className="absolute left-2 top-2"><span className="badge bg-white/90 text-primary-700">{p.category}</span></div>
                  {p.featured && <div className="absolute right-2 top-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /></div>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-navy-900">{p.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span className={cn('badge', p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>{p.status}</span>
                    {p.price && <span>{formatCurrency(p.price, p.currency)}</span>}
                    <span className="ml-auto">{formatDate(p.updated_at)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                    <Link to={`/projects/${p.slug}`} target="_blank" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600" aria-label="View"><Eye className="h-4 w-4" /></Link>
                    <button onClick={() => handleEdit(p)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600" aria-label="Edit"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDuplicate(p)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600" aria-label="Duplicate"><Copy className="h-4 w-4" /></button>
                    <button onClick={() => setConfirmDelete(p)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {editing && <ProjectForm project={editing} onClose={() => setEditing(null)} onSave={async (data) => { try { await saveProject.mutateAsync(data); toast.success(data.id ? 'Project updated successfully.' : 'Project added successfully.'); setEditing(null); } catch (err: any) { toast.error(err.message || 'Unable to save project.'); } }} saving={saveProject.isPending} />}
      {confirmDelete && <ConfirmDialog title="Delete Project" message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleteProject.isPending} />}
    </>
  );
}

function ProjectForm({ project, onClose, onSave, saving }: { project: Partial<Project>; onClose: () => void; onSave: (p: Partial<Project>) => void; saving: boolean }) {
  const [form, setForm] = useState<Partial<Project>>(project);
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const { data: images } = useProjectImages(project.id || '');
  const saveImage = useSaveProjectImage();
  const deleteImageMutation = useDeleteProjectImage();

  const set = (key: keyof Project, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const addTech = () => { const v = techInput.trim(); if (v && !(form.technologies || []).includes(v)) { set('technologies', [...(form.technologies || []), v]); setTechInput(''); } };
  const removeTech = (t: string) => set('technologies', (form.technologies || []).filter((x: string) => x !== t));

  const handleCoverUpload = async (file: File) => {
    const err = validateImageFile(file); if (err) { toast.error(err); return; }
    setUploading(true);
    try { const { url, error } = await uploadImage('project-images', file, 'covers/'); if (error) throw new Error(error); set('cover_image', url); toast.success('Cover image uploaded.'); } catch (e: any) { toast.error(e.message || 'Image upload failed.'); } finally { setUploading(false); }
  };

  const handleScreenshotUpload = async (file: File) => {
    if (!form.id) { toast.error('Save the project first before uploading screenshots.'); return; }
    const err = validateImageFile(file); if (err) { toast.error(err); return; }
    setUploading(true);
    try { const { url, error } = await uploadImage('project-screenshots', file); if (error) throw new Error(error); await saveImage.mutateAsync({ project_id: form.id, image_url: url, display_order: (images || []).length }); toast.success('Screenshot uploaded.'); } catch (e: any) { toast.error(e.message || 'Screenshot upload failed.'); } finally { setUploading(false); }
  };

  const handleDeleteScreenshot = async (imgId: string, url: string) => {
    try { await deleteImage('project-screenshots', url); await deleteImageMutation.mutateAsync({ id: imgId, image_url: url, project_id: form.id! } as any); toast.success('Screenshot deleted.'); } catch (e: any) { toast.error(e.message || 'Unable to delete screenshot.'); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) { toast.error('Project name and slug are required.'); return; }
    onSave({ ...form, price: form.price === null ? null : Number(form.price) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-navy-900">{form.id ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-navy-900"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <section><h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Project Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="label">Project Name *</label><input className="input" value={form.title || ''} onChange={(e) => { set('title', e.target.value); set('slug', slugify(e.target.value)); }} required /></div>
              <div><label className="label">Slug *</label><input className="input" value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} required /></div>
              <div><label className="label">Category *</label><select className="input" value={form.category || 'Business'} onChange={(e) => set('category', e.target.value)}>{PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="label">Client Name</label><input className="input" value={form.client_name || ''} onChange={(e) => set('client_name', e.target.value)} /></div>
              <div><label className="label">Project Price</label><input type="number" className="input" value={form.price ?? ''} onChange={(e) => set('price', e.target.value ? Number(e.target.value) : null)} placeholder="25000" /></div>
              <div><label className="label">Currency</label><select className="input" value={form.currency || 'INR'} onChange={(e) => set('currency', e.target.value)}><option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select></div>
              <div><label className="label">Status</label><select className="input" value={form.status || 'Completed'} onChange={(e) => set('status', e.target.value)}>{PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={form.featured || false} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
                <label className="flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={form.published || false} onChange={(e) => set('published', e.target.checked)} /> Published</label>
                <label className="flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={form.show_price || false} onChange={(e) => set('show_price', e.target.checked)} /> Show Price</label>
              </div>
            </div>
          </section>

          <section><h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Description</h3>
            <div className="space-y-4">
              <div><label className="label">Short Description</label><textarea className="input min-h-[60px]" value={form.short_description || ''} onChange={(e) => set('short_description', e.target.value)} /></div>
              <div><label className="label">Full Description</label><textarea className="input min-h-[120px]" value={form.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="label">Problem</label><textarea className="input min-h-[80px]" value={form.problem || ''} onChange={(e) => set('problem', e.target.value)} /></div>
                <div><label className="label">Solution</label><textarea className="input min-h-[80px]" value={form.solution || ''} onChange={(e) => set('solution', e.target.value)} /></div>
              </div>
              <div><label className="label">Features (one per line)</label><textarea className="input min-h-[80px]" value={form.features || ''} onChange={(e) => set('features', e.target.value)} /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="label">Challenges</label><textarea className="input min-h-[60px]" value={form.challenges || ''} onChange={(e) => set('challenges', e.target.value)} /></div>
                <div><label className="label">Results</label><textarea className="input min-h-[60px]" value={form.results || ''} onChange={(e) => set('results', e.target.value)} /></div>
              </div>
            </div>
          </section>

          <section><h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Technologies</h3>
            <div className="flex gap-2"><input className="input" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} placeholder="e.g. React, TypeScript..." /><button type="button" onClick={addTech} className="btn-secondary flex-shrink-0">Add</button></div>
            {(form.technologies || []).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{(form.technologies || []).map((t: string) => <span key={t} className="badge bg-primary-50 text-primary-700">{t}<button type="button" onClick={() => removeTech(t)} className="ml-1 hover:text-primary-900">&times;</button></span>)}</div>}
          </section>

          <section><h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Cover Image</h3>
            <div className="flex items-center gap-4">
              {form.cover_image ? <div className="relative"><img src={form.cover_image} alt="Cover" className="h-24 w-40 rounded-lg border border-slate-200 object-cover" /><button type="button" onClick={() => set('cover_image', '')} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm"><X className="h-3.5 w-3.5" /></button></div> : <div className="flex h-24 w-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50"><ImageIcon className="h-8 w-8 text-slate-300" /></div>}
              <label className="btn-secondary cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); e.target.value = ''; }} /></label>
            </div>
          </section>

          {form.id && (
            <section><h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Screenshots</h3>
              <label className="btn-secondary mb-3 cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload Screenshot<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleScreenshotUpload(f); e.target.value = ''; }} /></label>
              {images && images.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((img) => <div key={img.id} className="relative"><img src={img.image_url} alt={img.caption || ''} className="h-24 w-full rounded-lg border border-slate-200 object-cover" /><button type="button" onClick={() => handleDeleteScreenshot(img.id, img.image_url)} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm"><X className="h-3.5 w-3.5" /></button></div>)}</div>}
            </section>
          )}

          <section><h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Links</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div><label className="label">Live URL</label><input className="input" value={form.live_url || ''} onChange={(e) => set('live_url', e.target.value)} placeholder="https://..." /></div>
              <div><label className="label">GitHub URL</label><input className="input" value={form.github_url || ''} onChange={(e) => set('github_url', e.target.value)} placeholder="https://github.com/..." /></div>
              <div><label className="label">Demo URL</label><input className="input" value={form.demo_url || ''} onChange={(e) => set('demo_url', e.target.value)} placeholder="https://..." /></div>
            </div>
          </section>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Project</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function ConfirmDialog({ title, message, onCancel, onConfirm, loading }: { title: string; message: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-navy-900">{title}</h3>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete</button>
        </div>
      </motion.div>
    </div>
  );
}
