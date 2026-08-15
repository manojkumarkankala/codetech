import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import type { Service } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const Icon = getIcon(service.icon);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: index * 0.05 }} className="card card-hover group flex flex-col p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-sm transition-transform group-hover:scale-110"><Icon className="h-6 w-6" /></div>
      <h3 className="mt-5 text-lg font-bold text-navy-900">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{service.short_description || service.description}</p>

      {service.features.length > 0 && (
        <ul className="mt-4 space-y-2">
          {service.features.slice(0, 4).map((f) => <li key={f} className="flex items-start gap-2 text-sm text-slate-600"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" /> {f}</li>)}
        </ul>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        {service.starting_price !== null && service.starting_price !== undefined ? (
          <div><span className="text-xs text-slate-400">Starting from</span><p className="text-lg font-bold text-primary-700">{formatCurrency(service.starting_price, service.currency)}</p></div>
        ) : <span className="text-sm text-slate-400">Custom Pricing</span>}
        <Link to="/quote" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
      </div>
    </motion.div>
  );
}
