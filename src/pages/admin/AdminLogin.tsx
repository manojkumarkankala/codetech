import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useAuth } from '@/lib/auth';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@codetech.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password.'); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast.error('Invalid credentials. Please try again.'); } else { toast.success('Login successful!'); navigate('/admin'); }
  };

  return (
    <>
      <SEO title="Admin Login" />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-accent-50/30 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="card p-8 md:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-lg"><span className="text-xl font-bold">C</span></div>
              <h1 className="mt-5 text-2xl font-bold text-navy-900">CodeTech</h1>
              <p className="mt-1 text-sm text-slate-500">Admin Portal</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="label">Email / Username</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="email" className="input pl-10" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@codetech.com" required /></div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} className="input pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Logging in...</> : <>Login <ArrowRight className="h-4 w-4" /></>}</button>
            </form>
            <div className="mt-6 text-center"><a href="#" className="text-xs text-slate-400 hover:text-primary-600" onClick={(e) => { e.preventDefault(); toast.info('Contact your system administrator to reset your password.'); }}>Forgot Password?</a></div>
          </div>
          <div className="mt-6 text-center"><Link to="/" className="text-xs text-slate-400 hover:text-slate-600">← Back to Website</Link></div>
        </motion.div>
      </div>
    </>
  );
}
