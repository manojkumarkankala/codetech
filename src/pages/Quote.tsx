import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useCreateQuote } from '@/hooks/useData';
import { PROJECT_CATEGORIES, SERVICE_OPTIONS } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  project_type: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  description: z.string().min(20, 'Please describe your project in detail (min 20 characters)'),
});

type FormData = z.infer<typeof schema>;

export default function Quote() {
  const createQuote = useCreateQuote();
  const [submitted, setSubmitted] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const addFeature = () => { const val = featureInput.trim(); if (val && !features.includes(val)) { setFeatures([...features, val]); setFeatureInput(''); } };
  const removeFeature = (f: string) => setFeatures(features.filter((x) => x !== f));

  const onSubmit = async (data: FormData) => {
    try {
      await createQuote.mutateAsync({ ...data, features });
      toast.success('Quote request submitted! We will contact you soon.');
      setSubmitted(true); reset(); setFeatures([]);
    } catch (err: any) { toast.error(err.message || 'Unable to submit quote request.'); }
  };

  if (submitted) {
    return (
      <>
        <SEO title="Quote Request" />
        <div className="container-page py-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"><CheckCircle className="h-8 w-8 text-emerald-500" /></div>
            <h1 className="text-2xl font-bold text-navy-900">Quote Request Received!</h1>
            <p className="max-w-md text-slate-500">Thank you for your interest. Our team will review your requirements and contact you within 24 hours with a detailed proposal.</p>
            <button onClick={() => setSubmitted(false)} className="btn-secondary mt-2">Submit Another Request</button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Get a Free Quote" description="Get a free, no-obligation quote for your web development project from CodeTech." />
      <section className="gradient-hero border-b border-slate-100">
        <div className="container-page py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-primary-50 text-primary-700"><Sparkles className="h-3.5 w-3.5" /> Free Quote</span>
            <h1 className="mt-4 text-4xl font-bold text-navy-900 md:text-5xl">Get Your Free Project Quote</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">Tell us about your project and receive a detailed quote within 24 hours. No obligation, no hidden costs.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-page mx-auto max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 md:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div><label className="label">Full Name *</label><input className="input" {...register('name')} placeholder="Your name" />{errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}</div>
              <div><label className="label">Email *</label><input className="input" type="email" {...register('email')} placeholder="you@example.com" />{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}</div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div><label className="label">Phone</label><input className="input" {...register('phone')} placeholder="+91 98765 43210" /></div>
              <div><label className="label">Company</label><input className="input" {...register('company')} placeholder="Company name (optional)" /></div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="label">Project Type *</label>
                <select className="input" {...register('project_type')}><option value="">Select type</option>{PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}{SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                {errors.project_type && <p className="mt-1 text-xs text-red-500">{errors.project_type.message}</p>}
              </div>
              <div>
                <label className="label">Budget *</label>
                <select className="input" {...register('budget')}><option value="">Select budget</option><option>Under ₹10,000</option><option>₹10,000 - ₹25,000</option><option>₹25,000 - ₹50,000</option><option>₹50,000 - ₹1,00,000</option><option>Above ₹1,00,000</option></select>
                {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget.message}</p>}
              </div>
              <div>
                <label className="label">Timeline *</label>
                <select className="input" {...register('timeline')}><option value="">Select timeline</option><option>ASAP</option><option>1-2 weeks</option><option>1 month</option><option>2-3 months</option><option>Flexible</option></select>
                {errors.timeline && <p className="mt-1 text-xs text-red-500">{errors.timeline.message}</p>}
              </div>
            </div>
            <div>
              <label className="label">Desired Features (optional)</label>
              <div className="flex gap-2"><input className="input" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }} placeholder="e.g. Payment Gateway, Admin Dashboard..." /><button type="button" onClick={addFeature} className="btn-secondary flex-shrink-0">Add</button></div>
              {features.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{features.map((f) => <span key={f} className="badge bg-primary-50 text-primary-700">{f}<button type="button" onClick={() => removeFeature(f)} className="ml-1 hover:text-primary-900">&times;</button></span>)}</div>}
            </div>
            <div><label className="label">Project Description *</label><textarea className="input min-h-[140px] resize-y" {...register('description')} placeholder="Describe your project in detail. What are you trying to build? What features do you need? Who is your target audience?" />{errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}</div>
            <button type="submit" disabled={createQuote.isPending} className="btn-primary w-full">{createQuote.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Submit Quote Request <Send className="h-4 w-4" /></>}</button>
          </form>
        </div>
      </section>
    </>
  );
}
