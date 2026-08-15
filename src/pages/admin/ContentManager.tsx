import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Loader2, Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState } from '@/components/ui/States';
import {
  useContentKey, useSaveContent, useStatistics, useSaveStatistic, useDeleteStatistic,
  useWhyChoose, useSaveWhyChoose, useDeleteWhyChoose,
  useProcessSteps, useSaveProcessStep, useDeleteProcessStep,
} from '@/hooks/useData';
import { uploadImage, validateImageFile } from '@/lib/storage';
import { cn } from '@/lib/utils';

const TABS = ['Hero', 'About', 'Statistics', 'Why Choose Us', 'Process', 'CTA', 'Footer', 'Contact'] as const;
const ICON_OPTIONS = ['Code', 'Sparkles', 'Zap', 'ShieldCheck', 'TrendingUp', 'Smartphone', 'Rocket', 'LifeBuoy', 'Globe', 'CheckCircle', 'Target', 'Lightbulb', 'Search', 'Palette', 'Wrench', 'Award'];

export default function ContentManager() {
  const [tab, setTab] = useState<typeof TABS[number]>('Hero');

  return (
    <>
      <SEO title="Website Content" />
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-navy-900">Website Content</h1><p className="mt-1 text-sm text-slate-500">Edit content shown across the public website</p></div>
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
          {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', tab === t ? 'bg-primary-600 text-white shadow-sm' : 'text-navy-600 hover:bg-slate-100')}>{t}</button>)}
        </div>
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {tab === 'Hero' && <HeroTab />}
          {tab === 'About' && <AboutTab />}
          {tab === 'Statistics' && <StatisticsTab />}
          {tab === 'Why Choose Us' && <WhyChooseTab />}
          {tab === 'Process' && <ProcessTab />}
          {tab === 'CTA' && <CtaTab />}
          {tab === 'Footer' && <FooterTab />}
          {tab === 'Contact' && <ContactTab />}
        </motion.div>
      </div>
    </>
  );
}

function ContentCard({ children }: { children: React.ReactNode }) {
  return <div className="card p-6">{children}</div>;
}

function ImageUpload({ label, value, onChange, bucket }: { label: string; value: string; onChange: (url: string) => void; bucket: 'website-images' | 'branding' }) {
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (file: File) => {
    const err = validateImageFile(file); if (err) { toast.error(err); return; }
    setUploading(true);
    try { const { url, error } = await uploadImage(bucket, file); if (error) throw new Error(error); onChange(url); toast.success('Image uploaded.'); } catch (e: any) { toast.error(e.message || 'Upload failed.'); } finally { setUploading(false); }
  };
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-4">
        {value ? <div className="relative"><img src={value} alt={label} className="h-20 w-32 rounded-lg border border-slate-200 object-cover" /><button type="button" onClick={() => onChange('')} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"><X className="h-3.5 w-3.5" /></button></div> : <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50"><ImageIcon className="h-7 w-7 text-slate-300" /></div>}
        <label className="btn-secondary cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} /></label>
      </div>
    </div>
  );
}

function useContentEditor(key: string) {
  const { data, isLoading } = useContentKey(key);
  const saveContent = useSaveContent();
  const [local, setLocal] = useState<Record<string, any> | null>(null);

  const current = local ?? data ?? {};
  const set = (k: string, v: any) => setLocal({ ...current, [k]: v });
  const handleSave = async () => {
    try { await saveContent.mutateAsync({ key, content: current }); toast.success('Content saved successfully.'); setLocal(null); }
    catch (err: any) { toast.error(err.message || 'Unable to save content.'); }
  };
  return { current, set, isLoading, handleSave, saving: saveContent.isPending };
}

function SaveButton({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return <button onClick={onSave} disabled={saving} className="btn-primary mt-6">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes</button>;
}

function HeroTab() {
  const { current, set, isLoading, handleSave, saving } = useContentEditor('hero');
  if (isLoading) return <LoadingState message="Loading hero content..." />;
  return <ContentCard>
    <div className="grid gap-4 md:grid-cols-2">
      <div><label className="label">Hero Badge</label><input className="input" value={current.badge || ''} onChange={(e) => set('badge', e.target.value)} /></div>
      <div><label className="label">Enable Hero</label><select className="input" value={current.enabled !== false ? 'true' : 'false'} onChange={(e) => set('enabled', e.target.value === 'true')}><option value="true">Enabled</option><option value="false">Disabled</option></select></div>
    </div>
    <div className="mt-4"><label className="label">Hero Heading</label><input className="input" value={current.heading || ''} onChange={(e) => set('heading', e.target.value)} /></div>
    <div className="mt-4"><label className="label">Hero Description</label><textarea className="input min-h-[80px]" value={current.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div><label className="label">Primary Button Text</label><input className="input" value={current.primary_button_text || ''} onChange={(e) => set('primary_button_text', e.target.value)} /></div>
      <div><label className="label">Primary Button Link</label><input className="input" value={current.primary_button_link || ''} onChange={(e) => set('primary_button_link', e.target.value)} /></div>
      <div><label className="label">Secondary Button Text</label><input className="input" value={current.secondary_button_text || ''} onChange={(e) => set('secondary_button_text', e.target.value)} /></div>
      <div><label className="label">Secondary Button Link</label><input className="input" value={current.secondary_button_link || ''} onChange={(e) => set('secondary_button_link', e.target.value)} /></div>
    </div>
    <div className="mt-4"><ImageUpload label="Hero Image" value={current.image_url || ''} onChange={(url) => set('image_url', url)} bucket="website-images" /></div>
    <SaveButton onSave={handleSave} saving={saving} />
  </ContentCard>;
}

function AboutTab() {
  const { current, set, isLoading, handleSave, saving } = useContentEditor('about');
  if (isLoading) return <LoadingState message="Loading about content..." />;
  return <ContentCard>
    <div className="grid gap-4 md:grid-cols-2">
      <div><label className="label">Company Name</label><input className="input" value={current.company_name || ''} onChange={(e) => set('company_name', e.target.value)} /></div>
      <div><label className="label">Mission</label><input className="input" value={current.mission || ''} onChange={(e) => set('mission', e.target.value)} /></div>
    </div>
    <div className="mt-4"><label className="label">Company Description</label><textarea className="input min-h-[100px]" value={current.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div><label className="label">Vision</label><textarea className="input min-h-[60px]" value={current.vision || ''} onChange={(e) => set('vision', e.target.value)} /></div>
      <div><label className="label">Values</label><textarea className="input min-h-[60px]" value={current.values || ''} onChange={(e) => set('values', e.target.value)} /></div>
    </div>
    <div className="mt-4"><ImageUpload label="About Image" value={current.image_url || ''} onChange={(url) => set('image_url', url)} bucket="website-images" /></div>
    <SaveButton onSave={handleSave} saving={saving} />
  </ContentCard>;
}

function StatisticsTab() {
  const { data: stats, isLoading } = useStatistics();
  const saveStat = useSaveStatistic();
  const deleteStat = useDeleteStatistic();
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <LoadingState message="Loading statistics..." />;
  const EMPTY = { label: '', value: '', icon: 'TrendingUp', display_order: 0, active: true };

  const handleSave = async (data: any) => {
    try { await saveStat.mutateAsync(data); toast.success(data.id ? 'Statistic updated.' : 'Statistic added.'); setEditing(null); }
    catch (err: any) { toast.error(err.message || 'Unable to save.'); }
  };
  const handleDelete = async (id: string) => {
    try { await deleteStat.mutateAsync(id); toast.success('Statistic deleted.'); }
    catch (err: any) { toast.error(err.message || 'Unable to delete.'); }
  };

  return <div className="space-y-4">
    <div className="flex justify-end"><button onClick={() => setEditing({ ...EMPTY })} className="btn-primary"><Plus className="h-4 w-4" /> Add Statistic</button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(stats || []).map((s) => <div key={s.id} className="card p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-navy-900">{s.value}</h3><span className={cn('badge', s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>{s.active ? 'Active' : 'Off'}</span></div><p className="text-sm text-slate-500">{s.label}</p><div className="mt-3 flex gap-1.5 border-t border-slate-100 pt-3"><button onClick={() => setEditing(s)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600"><Edit className="h-4 w-4" /></button><button onClick={() => handleDelete(s.id)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}
    </div>
    {editing && <SimpleForm title={editing.id ? 'Edit Statistic' : 'Add Statistic'} onClose={() => setEditing(null)} onSave={() => handleSave(editing)} saving={saveStat.isPending}>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label">Label</label><input className="input" value={editing.label || ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} /></div>
        <div><label className="label">Value</label><input className="input" value={editing.value || ''} onChange={(e) => setEditing({ ...editing, value: e.target.value })} /></div>
        <div><label className="label">Icon</label><select className="input" value={editing.icon || 'TrendingUp'} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>{ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></div>
        <div><label className="label">Display Order</label><input type="number" className="input" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
    </SimpleForm>}
  </div>;
}

function WhyChooseTab() {
  const { data: items, isLoading } = useWhyChoose();
  const saveItem = useSaveWhyChoose();
  const deleteItem = useDeleteWhyChoose();
  const [editing, setEditing] = useState<any>(null);
  if (isLoading) return <LoadingState message="Loading..." />;
  const EMPTY = { title: '', description: '', icon: 'Sparkles', display_order: 0, active: true };
  const handleSave = async (data: any) => { try { await saveItem.mutateAsync(data); toast.success(data.id ? 'Item updated.' : 'Item added.'); setEditing(null); } catch (e: any) { toast.error(e.message); } };
  const handleDelete = async (id: string) => { try { await deleteItem.mutateAsync(id); toast.success('Item deleted.'); } catch (e: any) { toast.error(e.message); } };
  return <div className="space-y-4">
    <div className="flex justify-end"><button onClick={() => setEditing({ ...EMPTY })} className="btn-primary"><Plus className="h-4 w-4" /> Add Item</button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(items || []).map((w) => <div key={w.id} className="card p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-navy-900">{w.title}</h3><span className={cn('badge', w.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>{w.active ? 'Active' : 'Off'}</span></div><p className="mt-2 text-sm text-slate-500 line-clamp-2">{w.description}</p><div className="mt-3 flex gap-1.5 border-t border-slate-100 pt-3"><button onClick={() => setEditing(w)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600"><Edit className="h-4 w-4" /></button><button onClick={() => handleDelete(w.id)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}
    </div>
    {editing && <SimpleForm title={editing.id ? 'Edit Item' : 'Add Item'} onClose={() => setEditing(null)} onSave={() => handleSave(editing)} saving={saveItem.isPending}>
      <div><label className="label">Title</label><input className="input" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
      <div className="mt-4"><label className="label">Description</label><textarea className="input min-h-[60px]" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2"><div><label className="label">Icon</label><select className="input" value={editing.icon || 'Sparkles'} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>{ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></div><div><label className="label">Display Order</label><input type="number" className="input" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></div></div>
      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
    </SimpleForm>}
  </div>;
}

function ProcessTab() {
  const { data: steps, isLoading } = useProcessSteps();
  const saveStep = useSaveProcessStep();
  const deleteStep = useDeleteProcessStep();
  const [editing, setEditing] = useState<any>(null);
  if (isLoading) return <LoadingState message="Loading..." />;
  const EMPTY = { title: '', description: '', icon: 'CheckCircle', display_order: 0, active: true };
  const handleSave = async (data: any) => { try { await saveStep.mutateAsync(data); toast.success(data.id ? 'Step updated.' : 'Step added.'); setEditing(null); } catch (e: any) { toast.error(e.message); } };
  const handleDelete = async (id: string) => { try { await deleteStep.mutateAsync(id); toast.success('Step deleted.'); } catch (e: any) { toast.error(e.message); } };
  return <div className="space-y-4">
    <div className="flex justify-end"><button onClick={() => setEditing({ ...EMPTY })} className="btn-primary"><Plus className="h-4 w-4" /> Add Step</button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(steps || []).map((s) => <div key={s.id} className="card p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-navy-900">{s.title}</h3><span className={cn('badge', s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>{s.active ? 'Active' : 'Off'}</span></div><p className="mt-2 text-sm text-slate-500 line-clamp-2">{s.description}</p><div className="mt-3 flex gap-1.5 border-t border-slate-100 pt-3"><button onClick={() => setEditing(s)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-600"><Edit className="h-4 w-4" /></button><button onClick={() => handleDelete(s.id)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}
    </div>
    {editing && <SimpleForm title={editing.id ? 'Edit Step' : 'Add Step'} onClose={() => setEditing(null)} onSave={() => handleSave(editing)} saving={saveStep.isPending}>
      <div><label className="label">Title</label><input className="input" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
      <div className="mt-4"><label className="label">Description</label><textarea className="input min-h-[60px]" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2"><div><label className="label">Icon</label><select className="input" value={editing.icon || 'CheckCircle'} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>{ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></div><div><label className="label">Display Order</label><input type="number" className="input" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></div></div>
      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy-700"><input type="checkbox" className="h-4 w-4 rounded text-primary-600" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
    </SimpleForm>}
  </div>;
}

function CtaTab() {
  const { current, set, isLoading, handleSave, saving } = useContentEditor('cta');
  if (isLoading) return <LoadingState message="Loading CTA content..." />;
  return <ContentCard>
    <div><label className="label">Heading</label><input className="input" value={current.heading || ''} onChange={(e) => set('heading', e.target.value)} /></div>
    <div className="mt-4"><label className="label">Description</label><textarea className="input min-h-[60px]" value={current.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div><label className="label">Button Text</label><input className="input" value={current.button_text || ''} onChange={(e) => set('button_text', e.target.value)} /></div>
      <div><label className="label">Button Link</label><input className="input" value={current.button_link || ''} onChange={(e) => set('button_link', e.target.value)} /></div>
    </div>
    <SaveButton onSave={handleSave} saving={saving} />
  </ContentCard>;
}

function FooterTab() {
  const { current, set, isLoading, handleSave, saving } = useContentEditor('footer');
  if (isLoading) return <LoadingState message="Loading footer content..." />;
  return <ContentCard>
    <div><label className="label">Footer Description</label><textarea className="input min-h-[80px]" value={current.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
    <SaveButton onSave={handleSave} saving={saving} />
  </ContentCard>;
}

function ContactTab() {
  const { current, set, isLoading, handleSave, saving } = useContentEditor('contact');
  if (isLoading) return <LoadingState message="Loading contact content..." />;
  return <ContentCard>
    <div><label className="label">Heading</label><input className="input" value={current.heading || ''} onChange={(e) => set('heading', e.target.value)} /></div>
    <div className="mt-4"><label className="label">Description</label><textarea className="input min-h-[60px]" value={current.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
    <SaveButton onSave={handleSave} saving={saving} />
  </ContentCard>;
}

function SimpleForm({ title, children, onClose, onSave, saving }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-6 py-4"><h2 className="text-lg font-bold text-navy-900">{title}</h2><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
        <div className="p-6">{children}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5"><button onClick={onClose} className="btn-secondary">Cancel</button><button onClick={onSave} disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save</button></div>
        </div>
      </motion.div>
    </div>
  );
}
