import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Loader2, Upload, X, Image as ImageIcon, Building, Mail, Phone, MessageCircle, MapPin, Globe, Lock } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState } from '@/components/ui/States';
import { useSettings, useSaveSettings } from '@/hooks/useData';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { uploadImage, validateImageFile } from '@/lib/storage';

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const saveSettings = useSaveSettings();
  const { user } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  if (isLoading) return <><SEO title="Settings" /><LoadingState message="Loading settings..." /></>;
  const current = form ?? settings;
  const set = (k: string, v: any) => setForm({ ...current, [k]: v });

  const handleSave = async () => {
    try { await saveSettings.mutateAsync(current); toast.success('Settings updated successfully.'); setForm(null); }
    catch (err: any) { toast.error(err.message || 'Unable to save settings.'); }
  };
  const handleUpload = async (file: File, field: 'logo_url' | 'favicon_url') => {
    const err = validateImageFile(file); if (err) { toast.error(err); return; }
    setUploading(true);
    try { const { url, error } = await uploadImage('branding', file); if (error) throw new Error(error); set(field, url); toast.success(`${field === 'logo_url' ? 'Logo' : 'Favicon'} uploaded.`); } catch (e: any) { toast.error(e.message || 'Upload failed.'); } finally { setUploading(false); }
  };
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setChangingPass(true);
    try { const { error } = await supabase.auth.updateUser({ password: newPassword }); if (error) throw error; toast.success('Password changed successfully.'); setNewPassword(''); }
    catch (err: any) { toast.error(err.message || 'Unable to change password.'); }
    finally { setChangingPass(false); }
  };

  return (
    <>
      <SEO title="Settings" />
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-navy-900">Settings</h1><p className="mt-1 text-sm text-slate-500">Manage company information and configuration</p></div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900"><Building className="h-5 w-5 text-primary-600" /> Company Information</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div><label className="label">Company Name</label><input className="input" value={current.company_name || ''} onChange={(e) => set('company_name', e.target.value)} /></div>
            <div><label className="label">Tagline</label><input className="input" value={current.tagline || ''} onChange={(e) => set('tagline', e.target.value)} /></div>
            <div><label className="label">Email</label><input className="input" value={current.email || ''} onChange={(e) => set('email', e.target.value)} /></div>
            <div><label className="label">Phone</label><input className="input" value={current.phone || ''} onChange={(e) => set('phone', e.target.value)} /></div>
            <div><label className="label">WhatsApp</label><input className="input" value={current.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} /></div>
            <div><label className="label">Address</label><input className="input" value={current.address || ''} onChange={(e) => set('address', e.target.value)} /></div>
            <div className="md:col-span-2"><label className="label">Website URL</label><input className="input" value={current.website_url || ''} onChange={(e) => set('website_url', e.target.value)} /></div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900"><ImageIcon className="h-5 w-5 text-primary-600" /> Branding</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <label className="label">Logo</label>
              <div className="flex items-center gap-4">
                {current.logo_url ? <div className="relative"><img src={current.logo_url} alt="Logo" className="h-16 w-auto max-w-[160px] rounded-lg border border-slate-200 object-contain p-1" /><button onClick={() => set('logo_url', '')} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"><X className="h-3.5 w-3.5" /></button></div> : <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50"><ImageIcon className="h-6 w-6 text-slate-300" /></div>}
                <label className="btn-secondary cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'logo_url'); e.target.value = ''; }} /></label>
              </div>
            </div>
            <div>
              <label className="label">Favicon</label>
              <div className="flex items-center gap-4">
                {current.favicon_url ? <div className="relative"><img src={current.favicon_url} alt="Favicon" className="h-16 w-16 rounded-lg border border-slate-200 object-contain p-1" /><button onClick={() => set('favicon_url', '')} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"><X className="h-3.5 w-3.5" /></button></div> : <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50"><ImageIcon className="h-6 w-6 text-slate-300" /></div>}
                <label className="btn-secondary cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'favicon_url'); e.target.value = ''; }} /></label>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900"><Globe className="h-5 w-5 text-primary-600" /> Social Media Links</h2>
          <p className="mt-1 text-sm text-slate-500">Only filled-in links will be shown on the website.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div><label className="label">Instagram</label><input className="input" value={current.instagram || ''} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/..." /></div>
            <div><label className="label">LinkedIn</label><input className="input" value={current.linkedin || ''} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/..." /></div>
            <div><label className="label">Facebook</label><input className="input" value={current.facebook || ''} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/..." /></div>
            <div><label className="label">GitHub</label><input className="input" value={current.github || ''} onChange={(e) => set('github', e.target.value)} placeholder="https://github.com/..." /></div>
            <div><label className="label">YouTube</label><input className="input" value={current.youtube || ''} onChange={(e) => set('youtube', e.target.value)} placeholder="https://youtube.com/..." /></div>
            <div><label className="label">Twitter / X</label><input className="input" value={current.twitter || ''} onChange={(e) => set('twitter', e.target.value)} placeholder="https://twitter.com/..." /></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saveSettings.isPending || !form} className="btn-primary">{saveSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Settings</button>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900"><Lock className="h-5 w-5 text-primary-600" /> Change Admin Password</h2>
          <p className="mt-1 text-sm text-slate-500">Logged in as: <span className="font-semibold text-navy-700">{user?.email}</span></p>
          <form onSubmit={handleChangePassword} className="mt-5 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]"><label className="label">New Password</label><input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 6 chars)" minLength={6} /></div>
            <button type="submit" disabled={changingPass} className="btn-primary">{changingPass ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Change Password</button>
          </form>
        </div>
      </div>
    </>
  );
}
