import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import { useCreateMessage } from '@/hooks/useData';
import { SERVICE_OPTIONS } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  description: z.string().min(10, 'Please describe your project (min 10 characters)'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const createMessage = useCreateMessage();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await createMessage.mutateAsync(data);
      toast.success('Message sent successfully! We will get back to you soon.');
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: any) {
      toast.error(err.message || 'Unable to send message. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="card flex flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50"><svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
        <h3 className="text-xl font-bold text-navy-900">Thank You!</h3>
        <p className="max-w-md text-sm text-slate-500">Your message has been received. Our team will contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 md:p-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div><label className="label">Name *</label><input className="input" {...register('name')} placeholder="Your full name" />{errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}</div>
        <div><label className="label">Email *</label><input className="input" type="email" {...register('email')} placeholder="you@example.com" />{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}</div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div><label className="label">Phone</label><input className="input" {...register('phone')} placeholder="+91 98765 43210" /></div>
        <div><label className="label">Company</label><input className="input" {...register('company')} placeholder="Your company name" /></div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="label">Service Required</label>
          <select className="input" {...register('service')}><option value="">Select a service</option>{SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        </div>
        <div>
          <label className="label">Budget</label>
          <select className="input" {...register('budget')}><option value="">Select budget range</option><option>Under ₹10,000</option><option>₹10,000 - ₹25,000</option><option>₹25,000 - ₹50,000</option><option>₹50,000 - ₹1,00,000</option><option>Above ₹1,00,000</option></select>
        </div>
      </div>
      <div><label className="label">Subject *</label><input className="input" {...register('subject')} placeholder="What is this about?" />{errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}</div>
      <div><label className="label">Project Description *</label><textarea className="input min-h-[120px] resize-y" {...register('description')} placeholder="Tell us about your project, goals, and requirements..." />{errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}</div>
      <div>
        <label className="label">Timeline</label>
        <select className="input" {...register('timeline')}><option value="">Select timeline</option><option>ASAP</option><option>1-2 weeks</option><option>1 month</option><option>2-3 months</option><option>Flexible</option></select>
      </div>
      <button type="submit" disabled={createMessage.isPending} className="btn-primary w-full">
        {createMessage.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <>Send Message <Send className="h-4 w-4" /></>}
      </button>
    </form>
  );
}
