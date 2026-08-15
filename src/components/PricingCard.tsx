import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import type { PricingPackage } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function PricingCard({ pkg, index = 0 }: { pkg: PricingPackage; index?: number }) {
  const isCustom = pkg.price === 0;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: index * 0.05 }} className={`relative flex flex-col rounded-2xl border p-6 transition-all ${pkg.popular ? 'border-primary-300 bg-white shadow-lg ring-2 ring-primary-500/20 lg:scale-105' : 'border-slate-200 bg-white shadow-card hover:shadow-card-hover hover:border-primary-200'}`}>
      {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="badge bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-md"><Sparkles className="h-3.5 w-3.5" /> Most Popular</span></div>}
      <h3 className="text-lg font-bold text-navy-900">{pkg.name}</h3>
      {pkg.description && <p className="mt-2 text-sm text-slate-500">{pkg.description}</p>}
      <div className="mt-5 flex items-baseline gap-1">
        {isCustom ? <span className="text-3xl font-bold text-navy-900">Custom</span> : <><span className="text-3xl font-bold text-navy-900">{formatCurrency(pkg.price, pkg.currency)}</span><span className="text-sm text-slate-400">one-time</span></>}
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-slate-600"><span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${pkg.popular ? 'bg-primary-100 text-primary-600' : 'bg-emerald-50 text-emerald-500'}`}><Check className="h-3 w-3" /></span>{f}</li>)}
      </ul>
      <Link to="/quote" className={`mt-8 w-full ${pkg.popular ? 'btn-primary' : 'btn-secondary'}`}>{isCustom ? 'Contact Us' : 'Get Started'}</Link>
    </motion.div>
  );
}
